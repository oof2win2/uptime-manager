import { EventEmitter } from "stream"
import ChildProcess from "child_process"
import ENV from "./env"

export interface PortScanRequest {
	host: string
	port: number
	type: "tcp" | "udp"
}

interface PrivatePortScanRequest extends PortScanRequest {
	scanId: number
}

export type PortScanResult = {
	scanId: number
	succeeded: true
	result: "open" | "closed"
} | {
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

class RemotePortFetcherClass extends EventEmitter {
	private queue: PrivatePortScanRequest[] = []
	private currentlyRunning = 0
	private threadLimit: number
	public totalRequests = 0
	private scanId = 0

	private scanningInterval: NodeJS.Timeout
	constructor(limit = 4) {
		super()
		this.currentlyRunning += 1
		this.threadLimit = limit

		this.scanningInterval = setInterval(() => {
			if (this.currentlyRunning < this.threadLimit) this.scan()
		}, 1000)
	}
	addToQueue(request: PortScanRequest) {
		this.queue.push({
			...request,
			scanId: this.scanId
		})
		this.totalRequests += 1
		this.scanId += 1
	}

	private async scan() {
		// TODO: finish sending password to process
		const scan = this.queue.shift()
		if (!scan) return
		const cmd = `${scan.type === "udp" && "sudo --stdin"} nmap ${scan.type === "udp" && "-sU"} ${scan.host} -p ${scan.port}`
		const args: string[] = cmd.split(" ")
		const child = ChildProcess.spawn(args.shift() as string, args)
		
		const scanData: string[] = []
	
		const handleMessage = (chunk: { toString: () => string }) => {
			const data = chunk.toString()
			if (data.includes("Password:")) {
				child.stdin.write(ENV.SUDO_PASSWORD)
				child.stdin.end()
			} else {
				scanData.push(data)
			}
		}

		child.stdout?.on("data", handleMessage)
		child.stderr?.on("data", handleMessage)
		child.on("exit", () => {
			const dataLine = scanData.map((line) => {
				if (line.includes("Host is") || line.includes("Host seems")) return line
			}).filter(i=>i)[0]?.split("\n") as string[]
			if (dataLine[0].includes("Host seems")) {
				return this.emit("scanCompleted", {
					scanId: scan.scanId,
					succeeded: false
				})
			}
			console.log(dataLine)

			this.destroy()
		})
	}



	destroy() {
		clearInterval(this.scanningInterval)
	}
}
const run = new RemotePortFetcherClass()

run.addToQueue({
	host: "144.76.101.206",
	port: 39000,
	type: "udp",
})
run.on("scanCompleted", (result) => {
	console.log(result)
	run.destroy()
})