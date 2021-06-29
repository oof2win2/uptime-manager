import { Request, Response } from "express"
import { Session } from "express-session"
import { Client as DiscordOAuth2Client } from "@2pg/oauth"

export type ApolloContext = {
	req: Request & { session: Session & { userId?: string } }
	res: Response
	oauth: DiscordOAuth2Client
}