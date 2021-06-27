import { Resolver, Query, Arg, Mutation } from "type-graphql"
import Service, { ServiceClass, SocketType } from "../database/types/Service"
import { DocumentType } from "@typegoose/typegoose"

@Resolver()
export class ServiceResolver {
	@Query(() => [ServiceClass])
	Services(): Promise<DocumentType<ServiceClass>[]> {
		return Service.find({}).exec()
	}
	@Query(() => ServiceClass, { nullable: true })
	Service(
		@Arg("id", () => String) id: string
	): Promise<DocumentType<ServiceClass> | null> {
		return Service.findOne({ id: id }).exec()
	}

	@Mutation(() => ServiceClass)
	async CreateService(
		@Arg("name", () => String) name: string,
		@Arg("url", () => String) url: string,
		@Arg("socketType", () => String) type: SocketType,
		@Arg("port", () => Number) port: number,
	): Promise<DocumentType<ServiceClass>> {
		const service = await Service.create({
			name: name,
			url: url,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			socketType: type,
			port: port,
			logs: [],
		})
		return service
	}
	@Mutation(() => ServiceClass)
	async DeleteService(
		@Arg("id", () => String) id: string
	): Promise<DocumentType<ServiceClass> | null> {
		const service = await Service.findOneAndRemove({ id: id }).exec()
		return service
	}
	@Mutation(() => ServiceClass)
	async ModifyService(
		@Arg("id", () => String) id: string,
		@Arg("name", () => String) name: string,
		@Arg("url", () => String) url: string,
		@Arg("socketType", () => String) type: SocketType,
		@Arg("port", () => Number) port: number,
	): Promise<DocumentType<ServiceClass> | null> {
		const service = await Service.findOneAndUpdate({ id: id }, {
			$set: { name: name, url: url, socketType: type, port: port }
		}, { new: true }).exec()
		return service
	}
}