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
import RemotePortFetcherClass, { PortScanResult } from "./utils/remote-port-fetcher"
import LogModel from "./database/types/Logs"

const RemotePortFetcher = new RemotePortFetcherClass({
	limit: ENV.NMAP_THREAD_COUNT,
	sudoPassword: ENV.SUDO_PASSWORD,
})

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
			// origin: ENV.FRONTEND_URL
			// origin: "http://localhost:5555",
			origin: true,
			credentials: true
		}
	})

	app.use("/services", ServiceRouter)

	app.listen(ENV.EXPRESS_PORT || 3000, () => {
		console.log(`API connected at :${ENV.EXPRESS_PORT || 3000}`)
	})

	// fetch remote ports
	setInterval(async () => {
		let requests = await RemotePortFetcher.scanAllServices()
		const listener = (result: PortScanResult) => {
			requests = requests.filter((request) => request.scanId !== result.scanId)
			LogModel.create({
				serviceId: result.serviceId,
				reachable: result.succeeded && result.result == "open",
				createdAt: new Date()
			}).then(async (doc) => {
				const service = await ServiceModel.findOne({id: result.serviceId})
				service.logs.push(doc._id)
				service.save()
			})
			if (requests.length == 0) {
				RemotePortFetcher.off("scanCompleted", listener)
			}
		}
		RemotePortFetcher.on("scanCompleted", listener)
	}, 15*1000) // gather logs every 5 mins by default

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