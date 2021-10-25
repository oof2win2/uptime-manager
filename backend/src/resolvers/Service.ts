import { Resolver, Query, Arg, Mutation } from "type-graphql"
import Service, { ServiceClass } from "../database/types/Service"
import { DocumentType } from "@typegoose/typegoose"
import LogModel from "../database/types/Logs"

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

	@Mutation(() => ServiceClass, { nullable: true })
	async CreateService(
		@Arg("name", () => String) name: string,
		@Arg("url", () => String) url: string,
		@Arg("socketType", () => String) type: "tcp" | "udp",
		@Arg("port", () => Number) port: number,
		@Arg("postUpdating", () => Boolean) postUpdating: boolean,
	): Promise<DocumentType<ServiceClass> | null> {
		const service = await Service.create({
			name: name,
			url: url,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			socketType: type,
			port: port,
			logs: [],
			postUpdating: postUpdating
		})
		return service
	}
	@Mutation(() => ServiceClass, { nullable: true })
	async DeleteService(
		@Arg("id", () => String) id: string
	): Promise<DocumentType<ServiceClass> | null> {
		const service = await Service.findOneAndRemove({ id: id }).exec()
		service?.logs.forEach(logid => LogModel.findByIdAndDelete(logid))
		return service
	}
	@Mutation(() => ServiceClass, { nullable: true })
	async ModifyService(
		@Arg("id", () => String) id: string,
		@Arg("name", () => String) name: string,
		@Arg("url", () => String) url: string,
		@Arg("socketType", () => String) type: "tcp" | "udp",
		@Arg("port", () => Number) port: number,
		@Arg("postUpdating", () => Boolean) postUpdating: boolean
	): Promise<DocumentType<ServiceClass> | null> {
		const service = await Service.findOneAndUpdate({ id: id }, {
			$set: { name: name, url: url, socketType: type, port: port, postUpdating: postUpdating }
		}, { new: true }).exec()
		return service
	}
}