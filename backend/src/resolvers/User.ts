import User from "@2pg/oauth/lib/types/user"
import { Resolver, Query, Arg, Mutation, Ctx, ObjectType, Field, Subscription, Root, ResolverFilterData } from "type-graphql"
import AuthCodeModel from "../database/types/AuthCodes"
import UserModel, { UserClass } from "../database/types/User"
import { ApolloContext, FieldError } from "../types"

type UserSubscriber = Pick<UserClass, "discordUserId">

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => UserClass, { nullable: true })
	user?: UserClass
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
	GenerateAuthURL(
		@Ctx() ctx: ApolloContext,
	): AuthURL {
		return ctx.oauth.authCodeLink
	}


	@Mutation(() => UserResponse)
	async Login(
		@Ctx() ctx: ApolloContext,
	): Promise<UserResponse> {
		if (!ctx.req.session.userId) return {
			errors: [{
				field: "session.userId",
				error: "Session is no longer valid"
			}]
		}
		const AppUser = await UserModel.findOne({ _id: ctx.req.session.userId })
		if (!AppUser) return {
			errors: [{
				field: "session.userId",
				error: "session.userId is not a valid user ID"
			}]
		}
		return {
			user: AppUser
		}
	}

	@Mutation(() => LogoutResponse, {nullable: true})
	Logout(
		@Ctx() ctx: ApolloContext,
	): Promise<LogoutResponse> {
		return new Promise((resolve) => {
			ctx.req.session.destroy(() => resolve({
				completed: true
			}))
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
					errors: [{
						field: "AccessToken",
						error: "Invalid AccessToken"
					}]
				}
			}
			return {
				errors: [{
					field: "AccessToken",
					error: e
				}]
			}
		}

		if (!DiscordUser) return {
			errors: [{
				field: "AccessToken",
				error: "Could not find Discord user with AccessToken"
			}]
		}
		const AppToken = await AuthCodeModel.findOne({ code: appToken }).exec()
		const validAppToken = appToken ? AppToken?.code === appToken : false

		// if their user already exists then return them
		const ExistingAppUser = await UserModel.findOne({ discordUserId: DiscordUser.id }).exec()
		if (ExistingAppUser) {
			ctx.req.session.userId = ExistingAppUser._id
			return {
				user: ExistingAppUser
			}
		}

		const AppUser = await UserModel.create({
			discordUserId: DiscordUser.id,
			discordUserTag: DiscordUser.tag,
			discordUsername: DiscordUser.username,
			allowWriteAccess: validAppToken,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		})
		ctx.req.session.userId = AppUser._id
		return {
			user: AppUser,
			errors: (appToken && !validAppToken) ? [{
				field: "AppToken",
				error: "AppToken was invalid"
			}] : undefined
		}
	}

	@Mutation(() => UserResponse)
	async AllowWriteAccess(
		@Arg("code", () => String) code: string,
		@Arg("discordUserId", () => String) discordUserId: string,
	): Promise<UserResponse> {
		const AccessCode = await AuthCodeModel.findOne({code: code}).exec()
		if (!AccessCode) return {
			errors: [{
				field: "code",
				error: "code is an invalid access code"
			}]
		}
		const User = await UserModel.findOne({discordUserId: discordUserId}).exec()
		if (!User) return {
			errors: [{
				field: "discordUserId",
				error: "User not in database"
			}]
		}

		User.allowWriteAccess = true
		await User.save()
		this.updateUserSubscription(User)
		return {
			user: User
		}
	}
	@Mutation(() => UserResponse)
	async ForbidWriteAccess(
		@Arg("code", () => String) code: string,
		@Arg("discordUserId", () => String) discordUserId: string,
	): Promise<UserResponse> {
		const AccessCode = await AuthCodeModel.findOne({code: code}).exec()
		if (!AccessCode) return {
			errors: [{
				field: "code",
				error: "code is an invalid access code"
			}]
		}
		const User = await UserModel.findOne({discordUserId: discordUserId}).exec()
		if (!User) return {
			errors: [{
				field: "discordUserId",
				error: "User not in database"
			}]
		}

		User.allowWriteAccess = false
		await User.save()
		this.updateUserSubscription(User)
		return {
			user: User
		}
	}

	@Subscription(() => UserClass, {
		topics: "USER_UPDATE",
		filter: ({payload, args}: ResolverFilterData<UserClass, UserSubscriber, ApolloContext>) => {
			return payload.discordUserId === args.discordUserId
		}
	})
	updateUserSubscription(
		@Root() user: UserClass
	): UserClass {
		return user
	}
}