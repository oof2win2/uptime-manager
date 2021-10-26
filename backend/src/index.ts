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
import { AuthCodeResolver } from "./resolvers/AuthCodes"

import { COOKIE_NAME, __prod__ } from "./constants"
import { ApolloContext } from "./types"

import PostLogChecker from "./utils/PostLogChecker"

import ServiceRouter from "./routes/services"
import ENV from "./utils/env"
import RemotePortFetcherClass, {
	PortScanResult,
} from "./utils/remote-port-fetcher"
import prisma from "./utils/database"

const RemotePortFetcher = new RemotePortFetcherClass({
	limit: ENV.NMAP_THREAD_COUNT,
	sudoPassword: ENV.SUDO_PASSWORD,
})

const run = async () => {
	mongoose
		.connect(ENV.MONGOOSE_URI as string, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		})
		.then(() => {
			console.log(`Connected to database`)
		})

	const app = express()

	const DiscordOAuth2 = new DiscordOAuth2Client({
		id: ENV.DISCORD_CLIENTID,
		secret: ENV.DISCORD_CLIENTSECRET,
		redirectURI: ENV.DISCORD_REDIRECTURI,
		scopes: ["identify"],
	})

	const SQLiteStore = connectsqlite(session)

	app.use(
		session({
			name: COOKIE_NAME,
			store: new SQLiteStore({
				table: "sessions",
				db: "sessionsDBFile.sqlite",
				dir: "..", // save in root dir of project
			}),
			cookie: {
				maxAge: 1000 * 86400 * 365, // persist cookie for 1 year
				httpOnly: true,
				sameSite: "lax", //
				secure: false, // cookie works only in https
				// signed: true,
				// sameSite:
			},
			saveUninitialized: false,
			secret: ENV.SESSION_SECRET,
			resave: false,
		})
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [
				ServiceResolver,
				LogResolver,
				UserResolver,
				AuthCodeResolver,
			],
			validate: false,
		}),
		subscriptions: {
			path: "/subscriptions",
			onConnect: () => {
				console.log("connected!")
			},
		},
		context: ({ req, res }): ApolloContext => ({
			req,
			res,
			oauth: DiscordOAuth2,
		}),
	})

	// cors didnt work with it, that was the most annoying thing EVER to fix
	apolloServer.applyMiddleware({
		app,
		cors: {
			// origin: ENV.FRONTEND_URL
			origin: "http://localhost:3000",
			// origin: true,
			credentials: true,
		},
	})

	app.use("/services", ServiceRouter)

	app.listen(ENV.EXPRESS_PORT || 3000, () => {
		console.log(`API connected at :${ENV.EXPRESS_PORT || 3000}`)
	})

	// fetch remote ports
	setInterval(async () => {
		let requests = await RemotePortFetcher.scanAllServices()
		const listener = (result: PortScanResult) => {
			requests = requests.filter(
				(request) => request.scanId !== result.scanId
			)
			prisma.log
				.create({
					data: {
						serviceId: result.serviceId,
						reachable: result.succeeded && result.result == "open",
						// get the ping if it is open. can be null though
						ping:
							result.succeeded &&
							result.result == "open" &&
							result.ping,
					},
				})
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.then(() => {}) // the create doesnt run if this isnt there
			if (requests.length == 0) {
				RemotePortFetcher.off("scanCompleted", listener)
			}
		}
		RemotePortFetcher.on("scanCompleted", listener)
	}, 5 * 60 * 1000) // gather logs every 5 mins

	// This is used to manage the API requests and make sure that services that should
	// update their own status in fact do
	setInterval(async () => {
		const services = await prisma.service.findMany()
		PostLogChecker.CreateUnreachable(services)
	}, 5 * 60 * 1000)

	// this is for first setup.
	const authcodes = await prisma.authCode.count()
	if (authcodes == 0)
		await prisma.authCode.create({
			data: {
				code: "AUTHCODE",
			},
		})
}
run()

process.on("exit", () => {
	prisma.$disconnect()
})
