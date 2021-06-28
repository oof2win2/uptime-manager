import { getModelForClass, modelOptions, pre, prop, Ref } from "@typegoose/typegoose"
import { Field, ObjectType } from 'type-graphql'
import { getUserID } from '../../functions'
import LogModel, { LogClass } from "./Logs"

export type SocketType = "udp" | "tcp"

@pre<UserClass>("save", function (next) {
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
export class UserClass {
	@Field()
	@prop()
	public discordUserId!: string

	@Field()
	@prop()
	public discordUsername!: string

	@Field()
	@prop()
	public allowWriteAccess!: boolean

	// set by mongoose
	@Field()
	public createdAt!: Date
	@Field()
	public updatedAt!: Date
}
const UserModel = getModelForClass(UserClass)
export default UserModel