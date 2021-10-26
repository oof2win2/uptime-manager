import { Service, Log } from ".prisma/client"
import prisma from "./database"

class PostLogCheckerClass {
	private checked: Map<number, Date>
	constructor() {
		this.checked = new Map()
	}
	public Update(service: Service): void {
		this.checked.set(service.id, new Date())
	}
	public async CreateUnreachable(services: Service[]): Promise<void> {
		const logs: Array<Promise<Log | boolean>> = services.map(
			async (service) => {
				const lastReachedAt = this.checked.get(service.id)
				if (!lastReachedAt) {
					// if the service is not logged in this class yet
					this.checked.set(service.id, new Date())
					return true
				}

				if (lastReachedAt <= new Date(Date.now() + 5 * 60 * 1000)) {
					// if the service has not contacted us for over 5 minutes, it is determined as unreachable
					return await prisma.log.create({
						data: {
							serviceId: service.id,
							reachable: false,
						},
					})
				}
				if (lastReachedAt > new Date(Date.now() + 5 * 60 * 1000)) {
					// if the service has contacted us less than 5 minutes ago
					return await prisma.log.create({
						data: {
							serviceId: service.id,
							reachable: true,
						},
					})
				}
			}
		)
		await Promise.all(logs)
		return
	}
}
export default new PostLogCheckerClass()
