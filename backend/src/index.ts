import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import express from "express"
import { buildSchema } from "type-graphql"
import mongoose from "mongoose"
import config from "./config"
import { ServiceResolver } from "./resolvers/Service"
import GatherLogs from "./Logger"

const run = async () => {
	mongoose.connect(config.mongooseURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}).then(() => {
		console.log(`Connected to database`)
	})
	
	const app = express()

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ServiceResolver],
			validate: false
		})
	})

	apolloServer.applyMiddleware({ app })

	app.listen(config.expressPort, () => {
		console.log(`API connected at :${config.expressPort}`)
	})

	setInterval(GatherLogs, 15*1000) // gather logs every 0.25 mins by default
}
run()