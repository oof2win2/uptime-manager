import {
	Resolver,
	Query,
	Arg,
	Mutation,
	Field,
	ObjectType,
	UseMiddleware,
} from "type-graphql"
import { FieldError } from "../types"
import { isAuth } from "../middleware/isAuth"
import { AuthCodeModel } from "../types"
import prisma from "../utils/database"

@ObjectType()
class AuthCodeResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[]

	@Field(() => AuthCodeModel, { nullable: true })
	code?: AuthCodeModel

	@Field(() => [AuthCodeModel])
	codes?: AuthCodeModel[]
}
@Resolver()
export class AuthCodeResolver {
	@Query(() => AuthCodeResponse)
	@UseMiddleware(isAuth)
	async getAuthCodes(): Promise<AuthCodeResponse> {
		const codes = await prisma.authCode.findMany()
		return {
			codes: codes,
		}
	}

	@Mutation(() => AuthCodeResponse)
	@UseMiddleware(isAuth)
	async createAuthCode(): Promise<AuthCodeResponse> {
		const generateCode = (length = 8) =>
			Math.random().toString(16).substr(2, length)
		const code = await prisma.authCode.create({
			data: {
				code: generateCode(),
			},
		})
		return {
			code: code,
		}
	}

	@Mutation(() => AuthCodeResponse)
	@UseMiddleware(isAuth)
	async removeAuthCode(
		@Arg("code", () => String) code: string
	): Promise<AuthCodeResponse> {
		const authcode = await prisma.authCode.delete({
			where: {
				code: code,
			},
		})
		return {
			code: authcode,
		}
	}
}
