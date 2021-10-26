import { Request, Response } from "express"
import { Session } from "express-session"
import { Client as DiscordOAuth2Client } from "@2pg/oauth"
import { Field, ObjectType } from "type-graphql"
import { User, Service, Log, AuthCode } from ".prisma/client"

export type ApolloContext = {
	req: Request & { session: Session & { userId?: string } }
	res: Response
	oauth: DiscordOAuth2Client
}

@ObjectType()
export class FieldError {
	@Field()
	field!: string
	@Field()
	error!: string
}

@ObjectType()
export class UserModel implements User {
	@Field()
	discordUserId: string
	@Field()
	discordUserTag: string
	@Field()
	discordUsername: string
	@Field()
	allowWriteAccess: boolean
	@Field()
	createdAt: Date
}

@ObjectType()
export class LogModel implements Log {
	@Field()
	id: number
	@Field()
	serviceId: number
	@Field()
	reachable: boolean
	@Field()
	ping: number
	@Field()
	createdAt: Date
}

@ObjectType()
export class ServiceModel implements Service {
	@Field()
	id: number
	@Field()
	name: string
	@Field()
	postUpdating: boolean
	@Field()
	port: number
	@Field()
	url: string
	@Field()
	socketType: string
	@Field()
	createdAt: Date
	@Field()
	updatedAt: Date
}

@ObjectType()
export class ServiceLogModel extends ServiceModel {
	@Field(() => [LogModel])
	logs: LogModel[]
}

@ObjectType()
export class AuthCodeModel implements AuthCode {
	@Field()
	code: string
	@Field()
	createdAt: Date
}
