import ServiceModel, { ServiceClass } from "./database/types/Service"
import LogModel from "./database/types/Logs"
import lsofi from "lsofi"

// TODO: finish up pinging, both with TCP and UDP

interface ServiceStatus {
	online: boolean
	service: ServiceClass
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default async function GatherLogs(): Promise<void> {
	const services = await ServiceModel.find({})

	const servicePingsProm = services.map(async (service): Promise<ServiceStatus> => {
		switch (service.socketType) {
			case "udp": {
				if (service.url === "localhost") {
					const processID = await lsofi(service.port)
					if (!processID) return { online: false, service: service }
					return { online: true, service: service }
				} else {
					return { online: false, service: service }
				}
			}
			case "tcp": {
				if (service.url === "localhost") {
					const processID = await lsofi(service.port)
					if (!processID) return { online: false, service: service }
					return { online: true, service: service }
				} else {
					return { online: false, service: service }
				}
			}
		}
	})
	const servicePings = await Promise.all(servicePingsProm)
	servicePings.forEach(async (servicePing) => {
		const log = await LogModel.create({
			reachable: false
		})
		ServiceModel.updateOne({ id: servicePing.service.id }, { $push: { logs: log._id } }).exec()
	})
}