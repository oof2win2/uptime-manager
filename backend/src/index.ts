// validate env before anything else
process.chdir(__dirname) // change dir to current file location instead of wherever this is launching from

import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import express from "express"
import { buildSchema } from "type-graphql"
import mongoose from "mongoose"
// import GatherLogs from "./Logger"
import session from "express-session"
import connectsqlite from "connect-sqlite3"
import { Client as DiscordOAuth2Client } from "@2pg/oauth"

import { ServiceResolver } from "./resolvers/Service"
import { LogResolver } from "./resolvers/Logs"
import { UserResolver } from "./resolvers/User"
import { AuthCodeResolver } from './resolvers/AuthCodes'

import { COOKIE_NAME, __prod__ } from "./constants"
import { ApolloContext } from "./types"

import PostLogChecker from './utils/PostLogChecker'
import ServiceModel from './database/types/Service'

import ServiceRouter from "./routes/services"
import AuthCodeModel from './database/types/AuthCodes'
import ENV from "./utils/env"


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
			resolvers: [ServiceResolver, LogResolver, UserResolver, AuthCodeResolver],
			validate: false
		}),
		subscriptions: {
			path: '/subscriptions',
			onConnect: () => {
				console.log("connected!")
			},
		},
		context: ({ req, res }): ApolloContext => ({
			req,
			res,
			oauth: DiscordOAuth2,
		})
	})


	// cors didnt work with it, that was the most annoying thing EVER to fix
	apolloServer.applyMiddleware({
		app, cors: {
			origin: ENV.FRONTEND_URL,
			credentials: true
		}
	})

	app.use("/services", ServiceRouter)

	app.listen(ENV.EXPRESS_PORT || 3000, () => {
		console.log(`API connected at :${ENV.EXPRESS_PORT || 3000}`)
	})

	// This has been disabled because it uses nmap and for nmap to work with UDP you need sudo access
	// Rather use the API requests
	// setInterval(GatherLogs, 5*60*1000) // gather logs every 5 mins by default

	// This is used to manage the API requests
	setInterval(async () => {
		const services = await ServiceModel.find({})
		PostLogChecker.CreateUnreachable(services)
	}, 5*60*1000)


	// this is for first setup.
	const authcodes = await AuthCodeModel.find({})
	if (!authcodes.length) AuthCodeModel.create({
		code: "AUTHCODE",
		createdAt: Date.now(),
		updatedAt: Date.now(),
	})
}
run()