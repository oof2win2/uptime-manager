import { Request, Response } from "express"
import { Session } from "express-session"
import { Client as DiscordOAuth2Client } from "@2pg/oauth"
import { Field, ObjectType } from "type-graphql";

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