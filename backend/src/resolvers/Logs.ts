import { Resolver, Query, Arg } from "type-graphql"
import { ServiceLogModel, ServiceModel } from "../types"
import prisma from "../utils/database"

@Resolver()
export class LogResolver {
	@Query(() => ServiceLogModel, { nullable: true })
	async ServiceWithLogs(
		@Arg("id", () => Number) id: number
	): Promise<ServiceModel | null> {
		const res = await prisma.service.findFirst({
			where: {
				id: id,
			},
			include: {
				logs: true,
			},
		})
		return res
	}
}
