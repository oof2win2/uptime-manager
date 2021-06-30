import { MiddlewareFn } from "type-graphql"
import UserModel from "../database/types/User"
import { ApolloContext } from "../types"

export const isAuth: MiddlewareFn<ApolloContext> = async ({ context }, next) => {
	if (!context.req.session.userId) {
		throw new Error("not authenticated")
	}
	const user = UserModel.findOne({ _id: context.req.session.userId })
	if (!user) throw new Error("not authenticated")


	return next()
}