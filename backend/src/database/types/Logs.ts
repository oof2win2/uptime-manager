

import { getModelForClass, modelOptions, pre, prop } from "@typegoose/typegoose"
import { Field, ObjectType } from 'type-graphql'
import { getUserID } from '../../functions'

@pre<LogClass>("save", function (next) {
	this.id = getUserID(this._id.toString())
	next()
})

@ObjectType()
@modelOptions({
	schemaOptions: {
		timestamps: true
	}
})
export class LogClass {
	@Field()
	@prop()
	public id!: string

	@Field()
	@prop()
	public reachable!: boolean
}
const LogModel = getModelForClass(LogClass)
export default LogModel