import { DocumentType } from "@typegoose/typegoose"
import LogModel from "../database/types/Logs"
import { ServiceClass } from "../database/types/Service"

class PostLogCheckerClass {
	private checked: Map<string, Date>
	constructor() {
		this.checked = new Map()
	}
	public Update(service: ServiceClass): void {
		this.checked.set(service.id, new Date())
	}
	public async CreateUnreachable(services: DocumentType<ServiceClass>[]): Promise<void> {
		const logs: Array<Promise<ServiceClass|boolean>> = services.map(async (service): Promise<DocumentType<ServiceClass>|boolean> => {
			const lastReachedAt = this.checked.get(service.id)

			if (!lastReachedAt) {
				// if the service is not logged in this class yet
				this.checked.set(service.id, new Date())
				return true
			}
			
			if (lastReachedAt <= new Date(Date.now() + 5*60*1000)) {
				// if the service has not contacted us for over 5 minutes, it is determined as unreachable
				const log = await LogModel.create({
					serviceId: service.id,
					reachable: false,
					createdAt: Date.now()
				})
				service.logs.push(log._id)
				return await service.save()
			}
			if (lastReachedAt > new Date(Date.now() + 5*60*1000)) {
				// if the service has contacted us less than 5 minutes ago
				const log = await LogModel.create({
					serviceId: service.id,
					reachable: true,
					createdAt: Date.now()
				})
				service.logs.push(log._id)
				return await service.save()
			}
			return false // should never occur but ts...
		})
		await Promise.all(logs)
		return
	}
}
export default new PostLogCheckerClass()