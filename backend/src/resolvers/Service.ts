import { Resolver, Query, Arg, Mutation } from "type-graphql"
import { ServiceModel } from "../types"
import prisma from "../utils/database"

@Resolver()
export class ServiceResolver {
	@Query(() => [ServiceModel])
	Services(): Promise<ServiceModel[]> {
		return prisma.service.findMany()
	}
	@Query(() => ServiceModel, { nullable: true })
	Service(@Arg("id", () => Number) id: number): Promise<ServiceModel | null> {
		return prisma.service.findFirst({ where: { id: id } })
	}

	@Mutation(() => ServiceModel, { nullable: true })
	async CreateService(
		@Arg("name", () => String) name: string,
		@Arg("url", () => String) url: string,
		@Arg("socketType", () => String) type: "tcp" | "udp",
		@Arg("port", () => Number) port: number,
		@Arg("postUpdating", () => Boolean) postUpdating: boolean
	): Promise<ServiceModel | null> {
		const service = await prisma.service.create({
			data: {
				name: name,
				url: url,
				socketType: type,
				port: port,
				postUpdating: postUpdating,
			},
		})
		return service
	}
	@Mutation(() => ServiceModel, { nullable: true })
	async DeleteService(
		@Arg("id", () => Number) id: number
	): Promise<ServiceModel | null> {
		const service = await prisma.service.delete({ where: { id: id } })
		if (service)
			await prisma.log.deleteMany({
				where: {
					serviceId: service.id,
				},
			})
		return service
	}
	@Mutation(() => ServiceModel, { nullable: true })
	async ModifyService(
		@Arg("id", () => Number) id: number,
		@Arg("name", () => String) name: string,
		@Arg("url", () => String) url: string,
		@Arg("socketType", () => String) type: "tcp" | "udp",
		@Arg("port", () => Number) port: number,
		@Arg("postUpdating", () => Boolean) postUpdating: boolean
	): Promise<ServiceModel | null> {
		const service = await prisma.service.update({
			where: {
				id: id,
			},
			data: {
				name: name,
				url: url,
				socketType: type,
				port: port,
				postUpdating: postUpdating,
			},
		})
		return service[1][0]
	}
}
