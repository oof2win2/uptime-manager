/* eslint-disable @typescript-eslint/no-unused-vars */
import ServiceModel, { ServiceClass } from "./database/types/Service"
import LogModel from "./database/types/Logs"
import lsofi from "lsofi"
// import nmapWrapper from "./utils/nmapWrapper"

// TODO: finish up pinging, both with TCP and UDP

interface ServiceStatus {
	online: boolean
	service: ServiceClass
}

// const nmap = new nmapWrapper({
// 	maxScanTime: 12000
// })

// this is here because the lower does not work with UDP
export default async function GatherLogs(): Promise<void> {
	return
}

// export default async function GatherLogs(): Promise<void> {
// 	console.log("gathering logs")
// 	const services = await ServiceModel.find({})

// 	const servicePingsProm = services.map(async (service): Promise<ServiceStatus> => {
// 		switch (service.socketType) {
// 			case "udp": {
// 				if (service.url === "localhost") {
// 					const processID = await lsofi(service.port)
// 					if (!processID) return { online: false, service: service }
// 					return { online: true, service: service }
// 				} else {
// 					let process: ServiceStatus
// 					try {
// 						const out = await nmap.runNmap({
// 							ip: service.url,
// 							args: ["-sU", "-p", `${service.port}`]
// 						})
// 						process = {
// 							online: true,
// 							service
// 						}
// 					} catch {
// 						process = {
// 							online: false,
// 							service
// 						}
// 					}
// 					return process
// 				}
// 			}
// 			case "tcp": {
// 				if (service.url === "localhost") {
// 					const processID = await lsofi(service.port)
// 					if (!processID) return { online: false, service: service }
// 					return { online: true, service: service }
// 				} else {
// 					//TODO: test this out and complete
// 					let process: ServiceStatus
// 					try {
// 						const out = await nmap.runNmap({
// 							ip: service.url,
// 							args: ["-p", `${service.port}`]
// 						})
// 						console.log({service, out})
// 						process = {
// 							online: out[0].up,
// 							service
// 						}
// 					} catch {
// 						process = {
// 							online: false,
// 							service
// 						}
// 					}
// 					return process
// 				}
// 			}
// 		}
// 	})
// 	const servicePings = await Promise.all(servicePingsProm)
// 	servicePings.forEach(async (servicePing) => {
// 		const log = await LogModel.create({
// 			reachable: false,
// 			createdAt: Date.now(),
// 			serviceId: servicePing.service.id
// 		})
// 		console.log({servicePing})
// 		ServiceModel.updateOne({ id: servicePing.service.id }, { $push: { logs: log._id } }).exec()
// 	})
// }