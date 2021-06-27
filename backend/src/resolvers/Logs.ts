import { Resolver, Query, Arg, Mutation } from "type-graphql"
import Service, { ServiceClass, SocketType } from "../database/types/Service"
import { DocumentType } from "@typegoose/typegoose"



@Resolver()
export class LogResolver {
	@Query(() => ServiceClass, { nullable: true })
	async ServiceWithLogs(
		@Arg("id", () => String) id: string
	): Promise<DocumentType<ServiceClass> | null> {
		const res = await Service.findOne({ id: id }).populate("logs").exec()
		return res?.toObject()
	}
}