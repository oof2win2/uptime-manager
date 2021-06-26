import { getModelForClass, modelOptions, pre, prop } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { Field, ObjectType } from 'type-graphql'
import { getUserID } from '../../functions'

@pre<ServiceClass>("save", function (next) {
	this.id = getUserID(this._id.toString())
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
	public url!: string


	// set by mongoose
	@Field()
	public createdAt!: Date
	@Field()
	public updatedAt!: Date
}
const ServiceModel = getModelForClass(ServiceClass)
export default ServiceModel