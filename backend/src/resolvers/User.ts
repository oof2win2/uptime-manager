import User from "@2pg/oauth/lib/types/user"
import { Resolver, Query, Arg, Mutation, Ctx, ObjectType, Field } from "type-graphql"
import AuthCodeModel from "../database/types/AuthCodes"
import UserModel, { UserClass } from "../database/types/User"
import { ApolloContext } from "../types"

@ObjectType()
class FieldError {
	@Field()
	field!: string
	@Field()
	error!: string
}
@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => UserClass, { nullable: true })
	user?: UserClass
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
		@Arg("AccessToken", () => String) code: string,
		@Arg("State", () => String) state: string,
	): Promise<UserResponse> {
		console.log("authing...")
		const access = await ctx.oauth.getAccess(code)
		const DiscordUser = await ctx.oauth.getUser(access)

		if (!DiscordUser) return {
			errors: [{
				field: "AccessToken",
				error: "Could not find Discord user with AccessToken"
			}]
		}
		const AppUser = await UserModel.findOne({discordUserId: DiscordUser.id})
		if (!AppUser) return {
			errors: [{
				field: "AccessToken",
				error: "AccessToken does not yield a Discord user that matches a user"
			}]
		}
		return {
			user: AppUser
		}
	}
	
	@Mutation(() => UserResponse)
	async Signup(
		@Ctx() ctx: ApolloContext,
		@Arg("AccessToken", () => String) code: string,
		@Arg("State", () => String) state: string,
		@Arg("AppToken", () => String, {nullable: true}) appToken?: string
	): Promise<UserResponse> {
		let DiscordUser: User|null
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

		const AppToken = await AuthCodeModel.findOne({code: appToken}).exec()
		const validAppToken = appToken ? AppToken?.code === appToken : false

		const ExistingAppUser = await UserModel.findOne({discordUserId: DiscordUser.id}).exec()
		if (ExistingAppUser) return {
			errors: [{
				field: "AccessToken",
				error: "User with this Discord UserID already exists"
			}]
		}

		const AppUser = await UserModel.create({
			discordUserId: DiscordUser.id,
			discordUsername: DiscordUser.username,
			allowWriteAccess: validAppToken,
			createdAt: Date.now(),
			updatedAt: Date.now()
		})
		return {
			user: AppUser,
			errors: (appToken && !validAppToken) ? [{
				field: "AppToken",
				error: "AppToken was invalid"
			}] : undefined
		}
	}
}