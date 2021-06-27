import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import express from "express"
import { buildSchema } from "type-graphql"
import mongoose from "mongoose"
import config from "./config"
import { ServiceResolver } from "./resolvers/Service"
import GatherLogs from "./Logger"
import { LogResolver } from "./resolvers/Logs"
import cors from "cors"

const run = async () => {
	mongoose.connect(config.mongooseURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}).then(() => {
		console.log(`Connected to database`)
	})
	
	const app = express()
	app.use(cors())

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ServiceResolver, LogResolver],
			validate: false
		})
	})

	apolloServer.applyMiddleware({ app })

	app.listen(config.expressPort, () => {
		console.log(`API connected at :${config.expressPort}`)
	})


	// TODO: enable on prod, for now i have fake data
	// setInterval(GatherLogs, 60*5*1000) // gather logs every 5 mins by default
}
run()