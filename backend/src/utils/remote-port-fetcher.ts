import { EventEmitter } from "stream"
import ChildProcess from "child_process"
import ENV from "./env"
import ServiceModel from "../database/types/Service"

export interface PortScanRequest {
	serviceId: string
	host: string
	port: number
	type: "tcp" | "udp"
}

interface RegisteredPortScanRequest extends PortScanRequest {
	scanId: number
}

export type PortScanResult = {
	serviceId: string
	scanId: number
	succeeded: true
	result: "open" | "closed"
} | {
	serviceId: string
	scanId: number
	succeeded: false
}

export declare interface WebSocketEvents {
	scanCompleted: (result: PortScanResult) => void
}

declare interface RemotePortFetcherClass {
	on<E extends keyof WebSocketEvents>(
		event: E,
		listener: WebSocketEvents[E]
	): this
	off<E extends keyof WebSocketEvents>(
		event: E,
		listener: WebSocketEvents[E]
	): this
	once<E extends keyof WebSocketEvents>(
		event: E,
		listener: WebSocketEvents[E]
	): this
	emit<E extends keyof WebSocketEvents>(
		event: E,
		...args: Parameters<WebSocketEvents[E]>
	): boolean
}

interface RemotePortFetcherClassOpts {
	/**
	 * limit of concurrent requests
	 * @default 4
	 */
	limit?: number
	/**
	 * the password to the sudo account, to be used for UDP tests
	 */
	sudoPassword: string
	/**
	 * maximum amount of time to spend per scan, in ms
	 * @default 30000
	 */
	maxTime?: number
}

class RemotePortFetcherClass extends EventEmitter {
	private queue: RegisteredPortScanRequest[] = []
	private currentlyRunning = 0
	private threadLimit: number
	public totalRequests = 0
	private scanId = 0
	private readonly sudoPassword: string
	private readonly maxTime: number

	private scanningInterval: NodeJS.Timeout
	constructor({
		limit = 4,
		sudoPassword,
		maxTime = 30*1000,
	}: RemotePortFetcherClassOpts) {
		super()
		this.currentlyRunning += 1
		this.threadLimit = limit

		this.scanningInterval = setInterval(() => {
			if (this.currentlyRunning < this.threadLimit) this.scan()
		}, 1000)
		this.sudoPassword = sudoPassword
		this.maxTime = maxTime
	}
	addToQueue(request: PortScanRequest): RegisteredPortScanRequest {
		const regRequest = {
			...request,
			scanId: this.scanId
		}
		this.queue.push(regRequest)
		this.totalRequests += 1
		this.scanId += 1
		return regRequest
	}

	private async scan() {
		// TODO: finish sending password to process
		const scan = this.queue.shift()
		if (!scan) return
		// using the -Pn flag so TCP ports are scanned correctly
		const cmd = `${scan.type === "udp" ? "sudo --stdin " : ""}nmap ${scan.type === "udp" ? "-sU " : ""}${scan.host} -p ${scan.port} -Pn`.trim()
		const args: string[] = cmd.split(" ")
		const child = ChildProcess.spawn(args.shift() as string, args)
		
		const scanData: string[] = []
		const handleMessage = (chunk: { toString: () => string }) => {
			const data = chunk.toString()
			if (data.includes("Password:")) {
				child.stdin.write(this.sudoPassword)
				child.stdin.end()
			} else {
				scanData.push(data)
			}
		}

		const timeout = setTimeout(() => {
			child.kill("SIGINT")
		}, this.maxTime)

		child.stdout?.on("data", handleMessage)
		child.stderr?.on("data", handleMessage)
		child.on("exit", () => {
			clearTimeout(timeout)

			const dataLine = scanData.find((line) => {
				if (line.includes("Host is") || line.includes("Host seems")) return true
			}).split("\n")
			if (dataLine[0].includes("Host seems")) {
				return this.emit("scanCompleted", {
					serviceId: scan.serviceId,
					scanId: scan.scanId,
					succeeded: false
				})
			}

			let portLine: string[]
			dataLine.forEach((line, i) => {
				if (line.split(" ").filter(r=>r).includes("PORT")) portLine = dataLine[i+1].split(" ")
			})
			if (!portLine) return this.emit("scanCompleted", {
				serviceId: scan.serviceId,
				scanId: scan.scanId,
				succeeded: false
			})
			
			if (["closed", "filtered", "closed|filtered"].includes(portLine[1])) return this.emit("scanCompleted", {
				serviceId: scan.serviceId,
				scanId: scan.scanId,
				succeeded: true,
				result: "closed"
			})
			return this.emit("scanCompleted", {
				serviceId: scan.serviceId,
				scanId: scan.scanId,
				succeeded: true,
				result: "open"
			})
		})
	}

	/**
	 * Add all service fetches to the queue
	 */
	async scanAllServices(): Promise<RegisteredPortScanRequest[]> {
		const services = await ServiceModel.find({})

		const requests = services.map((service) => {
			if (service.postUpdating) return 
			
			return this.addToQueue({
				serviceId: service.id,
				host: service.url,
				port: service.port,
				type: service.socketType
			})
		}).filter(s=>s)

		return requests
	}

	destroy(): void {
		clearInterval(this.scanningInterval)
	}
}

export default RemotePortFetcherClass