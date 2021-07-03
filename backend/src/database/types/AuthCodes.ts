import { getModelForClass, modelOptions, pre, prop } from "@typegoose/typegoose"
import { Field, ObjectType } from "type-graphql"
import { getUserID } from '../../functions'

export type SocketType = "udp" | "tcp"

@pre<AuthCodeClass>("save", function (next) {
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
export class AuthCodeClass {
	@Field()
	@prop()
	public code!: string

	// set by mongoose
	@Field()
	public createdAt!: Date
	@Field()
	public updatedAt!: Date
}
const AuthCodeModel = getModelForClass(AuthCodeClass)
export default AuthCodeModel