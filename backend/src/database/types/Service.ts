import { getModelForClass, modelOptions, pre, prop, Ref } from "@typegoose/typegoose"
import { Field, ObjectType } from 'type-graphql'
import { getUserID } from '../../functions'
import LogModel, { LogClass } from "./Logs"

export type SocketType = "udp" | "tcp"

@pre<ServiceClass>("save", function (next) {
	this.id = getUserID(this._id.toString())
	this.updatedAt = new Date()
	next()
})

@ObjectType()
@modelOptions({
	schemaOptions: {
		timestamps: true
	}
})
export class ServiceClass {
	@Field()
	@prop()
	public id!: string

	@Field()
	@prop()
	public name!: string

	@Field()
	@prop()
	public port!: number

	@Field()
	@prop()
	public url!: string

	@Field()
	@prop({ enum: ["udp", "tcp"] })
	public socketType!: SocketType


	// set by mongoose
	@Field()
	public createdAt!: Date
	@Field()
	public updatedAt!: Date

	@prop({ ref: () => LogClass })
	public logs!: Ref<LogClass>[]
}
const ServiceModel = getModelForClass(ServiceClass)
export default ServiceModel