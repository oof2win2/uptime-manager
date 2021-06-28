import { getModelForClass, modelOptions, pre, prop, Ref } from "@typegoose/typegoose"
import { getUserID } from '../../functions'

export type SocketType = "udp" | "tcp"

@pre<AuthCodeClass>("save", function (next) {
	this.id = getUserID(this._id.toString())
	this.updatedAt = new Date()
	next()
})

@modelOptions({
	schemaOptions: {
		timestamps: true
	}
})
export class AuthCodeClass {
	@prop()
	public code!: string

	// set by mongoose
	public createdAt!: Date
	public updatedAt!: Date
}
const AuthCodeModel = getModelForClass(AuthCodeClass)
export default AuthCodeModel