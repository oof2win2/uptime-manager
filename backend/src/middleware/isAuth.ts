import { MiddlewareFn } from "type-graphql"
import { ApolloContext } from "../types"
import prisma from "../utils/database"

export const isAuth: MiddlewareFn<ApolloContext> = async (
	{ context },
	next
) => {
	if (!context.req.session.userId) {
		throw new Error("not authenticated")
	}
	const user = await prisma.user.findFirst({
		where: { discordUserId: context.req.session.userId },
	})
	if (!user) throw new Error("not authenticated")

	return next()
}
