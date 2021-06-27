import config from "./src/config"
import mongoose from "mongoose"
import ServiceClass from "./src/database/types/Service"
import LogClass from "./src/database/types/Logs"
import { ObjectId } from "bson"

const run = async () => {
	await mongoose.connect(config.mongooseURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	console.log(`Connected to database`)
	const logIDs = new Array<ObjectId>()
	const hours = JSON.parse(`["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"]`)
	const a = new Array(30).fill(0).map(async (_, day) => {
		const a = new Array(48).fill(0).map(async (_, i) => {
			const t = hours[i].split(":").map((str: string)=> parseInt(str))
			const time = new Date(2021, 6, day, t[0], t[1])
			const log = await LogClass.create({
				reachable: Math.random() <= Math.random(),
				createdAt: time
			})
			logIDs.push(log._id)
		})
		return await Promise.all(a)
	})
	await Promise.all(a)
	console.log(logIDs)
	console.log("Done creating logs")
	await ServiceClass.updateOne({}, {
		$set: {logs: logIDs}
	}).exec()
	console.log("Updated doc.")
	mongoose.disconnect()
}
run()