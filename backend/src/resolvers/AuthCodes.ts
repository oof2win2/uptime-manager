import { Resolver, Query, Arg, Mutation, Field, ObjectType, UseMiddleware } from "type-graphql"
import AuthCodeModel, { AuthCodeClass } from "../database/types/AuthCodes"
import { FieldError } from "../types"
import { isAuth } from "../middleware/isAuth"

@ObjectType()
class AuthCodeResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[]

	@Field(() => AuthCodeClass, {nullable: true})
	code?: AuthCodeClass

	@Field(() => [AuthCodeClass])
	codes?: AuthCodeClass[]
}
@Resolver()
export class AuthCodeResolver {
	@Query(() => AuthCodeResponse)
	@UseMiddleware(isAuth)
	async getAuthCodes(): Promise<AuthCodeResponse> {
		const codes = await AuthCodeModel.find({}) || undefined
		return {
			codes: codes
		}
	}

	@Mutation(() => AuthCodeResponse)
	@UseMiddleware(isAuth)
	async createAuthCode(): Promise<AuthCodeResponse> {
		const generateCode = (length = 8) => Math.random().toString(16).substr(2, length)
		const code = await AuthCodeModel.create({
			code: generateCode(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		})
		return {
			code: code
		}
	}

	@Mutation(() => AuthCodeResponse)
	@UseMiddleware(isAuth)
	async removeAuthCode(
		@Arg("code", () => String) code: string
	): Promise<AuthCodeResponse> {
		const AuthCode = await AuthCodeModel.findOneAndDelete({code: code}).exec() || undefined
		return {
			code: AuthCode
		}
	}
}