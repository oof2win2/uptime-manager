import { Request, Response, Session } from "express"
import { Client as DiscordOAuth2Client } from "@2pg/oauth"

export type ApolloContext = {
	req: Request & { session: Session }
	res: Response
	oauth: DiscordOAuth2Client
}