import { getModelForClass, pre, prop } from "@typegoose/typegoose"
import { Field, ObjectType } from 'type-graphql'
import { getUserID } from '../../functions'

@pre<ServiceClass>("save", function(next) {
	this.id = getUserID(this._id.toString())
	next()
})

@ObjectType()
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
}
const ServiceModel = getModelForClass(ServiceClass)
export default ServiceModel