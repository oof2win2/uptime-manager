// Create fake data for services

import ServiceModel from "../src/database/types/Service";
import dotenv from "dotenv"
import LogModel, { LogClass } from "../src/database/types/Logs";
import { DocumentType, mongoose, Ref } from "@typegoose/typegoose";
import { ObjectId } from "bson";

dotenv.config({
	path: "../.env"
})

const run = async () => {
	const services = await ServiceModel.find({}).exec()
	await Promise.all(services.map(async (service) => {
		const logs = await Promise.all(new Array(30).fill(0).map(async(_, day): Promise<Ref<LogClass, ObjectId | undefined>[]> => {
			let logs: Promise<DocumentType<LogClass>>[] = []
			const date = new Date()
			date.setDate(day)
			for (let i = 0; i < 24; i++) {
				logs.push(LogModel.create({
					reachable: Math.random() > 0.5,
					createdAt: date,
					serviceId: service._id
				}))
			}
			return (await Promise.all(logs)).map(log => log._id)
		}))
		service.logs = []
		logs.forEach(day => {
			service.logs = [...service.logs, ...day]
		})
		await service.save()
		console.log("saved", {service})
	}))
	mongoose.disconnect()
}

mongoose.connect(process.env.MONGOOSE_URI as string, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(run)