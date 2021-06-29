// validate env before anything else
import { cleanEnv, str, num, url, port } from 'envalid'
import dotenv from "dotenv"
process.chdir(__dirname) // change dir to current file location instead of wherever this is launching from

dotenv.config({
	path: "../.env"
})

const ENV = cleanEnv(process.env, {
	DISCORD_CLIENTID: str({ docs: "https://discord.com/developers/docs/topics/oauth2" }),
	DISCORD_CLIENTSECRET: str({ docs: "https://discord.com/developers/docs/topics/oauth2" }),
	DISCORD_REDIRECTURI: url({ docs: "https://discord.com/developers/docs/topics/oauth2" }),
	MONGOOSE_URI: url({ example: "mongodb+srv://dbUse:dbPassword@databaseLocation/defaultDatabaseName" }),
	EXPRESS_PORT: port({ default: 5555 }),
	SESSION_SECRET: str()
})


import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import express from "express"
import { buildSchema } from "type-graphql"
import mongoose from "mongoose"
import { ServiceResolver } from "./resolvers/Service"
import GatherLogs from "./Logger"
import { LogResolver } from "./resolvers/Logs"
import cors from "cors"
import httpContext from "express-http-context"
import session from "express-session"
import connectsqlite from "connect-sqlite3"

import { Client as DiscordOAuth2Client } from "@2pg/oauth"


import { COOKIE_NAME, __prod__ } from "./constants"
import { ApolloContext } from "./types"
import { UserResolver } from "./resolvers/User"

const run = async () => {
	mongoose.connect(ENV.MONGOOSE_URI as string, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}).then(() => {
		console.log(`Connected to database`)
	})

	const app = express()

	const DiscordOAuth2 = new DiscordOAuth2Client({
		id: ENV.DISCORD_CLIENTID,
		secret: ENV.DISCORD_CLIENTSECRET,
		redirectURI: ENV.DISCORD_REDIRECTURI,
		scopes: ["identify"]
	})

	const SQLiteStore = connectsqlite(session)

	app.use(
		session({
			name: COOKIE_NAME,
			store: new SQLiteStore,
			cookie: {
				maxAge: 1000 * 86400 * 365, // persist cookie for 1 year
				httpOnly: true,
				sameSite: "none",	// 
				secure: __prod__,	// cookie works only in https
			},
			saveUninitialized: false,
			secret: ENV.SESSION_SECRET,
			resave: false,
		})
	)


	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ServiceResolver, LogResolver, UserResolver],
			validate: false
		}),
		context: ({ req, res }): ApolloContext => ({
			req,
			res,
			oauth: DiscordOAuth2,
		})
	})


	// cors didnt work with it, that was the most annoying thing EVER to fix
	apolloServer.applyMiddleware({
		app, cors: {
			origin: "http://localhost:3000",
			credentials: true
		}
	})

	app.listen(ENV.EXPRESS_PORT || 3000, () => {
		console.log(`API connected at :${ENV.EXPRESS_PORT || 3000}`)
	})


	// TODO: enable on prod, for now i have fake data
	// setInterval(GatherLogs, 60*5*1000) // gather logs every 5 mins by default
}
run()