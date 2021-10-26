import User from "@2pg/oauth/lib/types/user"
import {
	Resolver,
	Query,
	Arg,
	Mutation,
	Ctx,
	ObjectType,
	Field,
	Subscription,
	Root,
	ResolverFilterData,
} from "type-graphql"
import { ApolloContext, FieldError } from "../types"
import prisma from "../utils/database"
import { UserModel } from "../types"

type UserSubscriber = Pick<UserModel, "discordUserId">

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[]

	// @Field(() => UserModel, { nullable: true })
	@Field({ nullable: true })
	user?: UserModel
}

@ObjectType()
class LogoutResponse {
	@Field()
	completed!: boolean
}

@ObjectType()
class AuthURL {
	@Field()
	state!: string
	@Field()
	url!: string
}

@Resolver()
export class UserResolver {
	@Query(() => AuthURL)
	GenerateAuthURL(@Ctx() ctx: ApolloContext): AuthURL {
		return ctx.oauth.authCodeLink
	}

	@Mutation(() => UserResponse)
	async Login(@Ctx() ctx: ApolloContext): Promise<UserResponse> {
		if (!ctx.req.session.userId)
			return {
				errors: [
					{
						field: "session.userId",
						error: "Session is no longer valid",
					},
				],
			}
		const AppUser = await prisma.user.findFirst({
			where: { discordUserId: ctx.req.session.userId },
		})
		if (!AppUser)
			return {
				errors: [
					{
						field: "session.userId",
						error: "session.userId is not a valid user ID",
					},
				],
			}
		return {
			user: AppUser,
		}
	}

	@Mutation(() => LogoutResponse, { nullable: true })
	Logout(@Ctx() ctx: ApolloContext): Promise<LogoutResponse> {
		return new Promise((resolve) => {
			ctx.req.session.destroy(() =>
				resolve({
					completed: true,
				})
			)
		})
	}

	@Mutation(() => UserResponse)
	async SignupOrLogin(
		@Ctx() ctx: ApolloContext,
		@Arg("AccessToken", () => String) code: string,
		@Arg("State", () => String) state: string,
		@Arg("AppToken", () => String, { nullable: true }) appToken?: string
	): Promise<UserResponse> {
		let DiscordUser: User | null
		let access: string

		try {
			access = await ctx.oauth.getAccess(code)
			DiscordUser = await ctx.oauth.getUser(access)
		} catch (e) {
			if (e.statusCode === 400) {
				return {
					errors: [
						{
							field: "AccessToken",
							error: "Invalid AccessToken",
						},
					],
				}
			}
			return {
				errors: [
					{
						field: "AccessToken",
						error: e,
					},
				],
			}
		}

		if (!DiscordUser)
			return {
				errors: [
					{
						field: "AccessToken",
						error: "Could not find Discord user with AccessToken",
					},
				],
			}
		const AppToken = await prisma.authCode.findFirst({
			where: {
				code: appToken,
			},
		})
		const validAppToken = appToken ? AppToken?.code === appToken : false

		// if their user already exists then return them
		const ExistingAppUser = await prisma.user.findFirst({
			where: { discordUserId: ctx.req.session.userId },
		})
		if (ExistingAppUser) {
			ctx.req.session.userId = ExistingAppUser.discordUserId
			return {
				user: ExistingAppUser,
			}
		}

		const AppUser = await prisma.user.create({
			data: {
				discordUserId: DiscordUser.id,
				discordUserTag: DiscordUser.tag,
				discordUsername: DiscordUser.username,
				allowWriteAccess: validAppToken,
			},
		})
		ctx.req.session.userId = AppUser.discordUserId
		return {
			user: AppUser,
			errors:
				appToken && !validAppToken
					? [
							{
								field: "AppToken",
								error: "AppToken was invalid",
							},
					  ]
					: undefined,
		}
	}

	@Mutation(() => UserResponse)
	async AllowWriteAccess(
		@Arg("code", () => String) code: string,
		@Arg("discordUserId", () => String) discordUserId: string
	): Promise<UserResponse> {
		const AccessCode = await prisma.authCode.findFirst({
			where: {
				code: code,
			},
		})
		if (!AccessCode)
			return {
				errors: [
					{
						field: "code",
						error: "code is an invalid access code",
					},
				],
			}
		const User = await prisma.user.findFirst({
			where: {
				discordUserId: discordUserId,
			},
		})
		if (!User)
			return {
				errors: [
					{
						field: "discordUserId",
						error: "User not in database",
					},
				],
			}

		User.allowWriteAccess = true
		await prisma.user.update({
			where: {
				discordUserId: discordUserId,
			},
			data: User,
		})
		this.updateUserSubscription(User)
		return {
			user: User,
		}
	}
	@Mutation(() => UserResponse)
	async ForbidWriteAccess(
		@Arg("code", () => String) code: string,
		@Arg("discordUserId", () => String) discordUserId: string
	): Promise<UserResponse> {
		const AccessCode = await prisma.authCode.findFirst({
			where: {
				code: code,
			},
		})
		if (!AccessCode)
			return {
				errors: [
					{
						field: "code",
						error: "code is an invalid access code",
					},
				],
			}
		const User = await prisma.user.findFirst({
			where: {
				discordUserId: discordUserId,
			},
		})
		if (!User)
			return {
				errors: [
					{
						field: "discordUserId",
						error: "User not in database",
					},
				],
			}

		User.allowWriteAccess = false
		await prisma.user.update({
			where: {
				discordUserId: discordUserId,
			},
			data: User,
		})
		this.updateUserSubscription(User)
		return {
			user: User,
		}
	}

	@Subscription(() => UserModel, {
		topics: "USER_UPDATE",
		filter: ({
			payload,
			args,
		}: ResolverFilterData<UserModel, UserSubscriber, ApolloContext>) => {
			return payload.discordUserId === args.discordUserId
		},
	})
	updateUserSubscription(@Root() user: UserModel): UserModel {
		return user
	}
}
