/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventEmitter } from "events"
import { spawn } from "child_process"

class NoPasswordError extends Error {
	constructor() {
		super()
		this.name = "NoPasswordError"
		this.message = "No password was provided to run an nmap scan that requires higher user priviliges"
	}
}

type NmapOutProcessPortType = "tcp" | "udp"
type NmapOutProcessState = "open" | "closed" | "filtered" | "unfiltered" | "open|filtered" | "open|unfiltered"

interface NmapOutput {
	up: boolean
	port: number
	portType: NmapOutProcessPortType
	state: NmapOutProcessState
	service: string
}
interface NmapOpts {
	nmapLocation?: string
	maxScanTime: number
	resultEncoding?: BufferEncoding
	userPassword?: string
}

interface NmapRunOpts {
	ip: string
	args: string[]
	maxScanTime?: number
	resultEncoding?: BufferEncoding
	userPassword?: string
	nmapLocation?: string
}

export default class nmapWrapper extends EventEmitter {
	private opts: NmapOpts
	constructor(opts: NmapOpts) {
		super()

		if (!opts.resultEncoding) opts.resultEncoding = "utf-8"
		this.opts = opts
	}
	public async runNmap(opts: NmapRunOpts): Promise<NmapOutput[]> {
		const nmapCmd = opts.nmapLocation || this.opts.nmapLocation || "nmap"
		const resultEncoding = opts.resultEncoding || this.opts.resultEncoding
		const userPassword = opts.userPassword || this.opts.userPassword
		if (!userPassword) throw NoPasswordError

		return new Promise((resolve) => {
			const stdout: string[] = []
			const stderr: string[] = []
			const nmapProcess = spawn("sudo", ["nmap", opts.ip, ...opts.args], {
				timeout: opts.maxScanTime || this.opts.maxScanTime
			})

			nmapProcess.stdout.on("data", (data: Buffer | string) => {
				if (Buffer.isBuffer(data)) data = data.toString(resultEncoding)
				if (data.includes("You requested a scan type which requires root privileges.")) {
					if (!userPassword) throw NoPasswordError
					opts.args?.unshift("nmap")
					opts.nmapLocation = "sudo"
					return resolve(this.runNmap(opts))
				}

				const parsedData = this.parseNmapData(data)
				if (parsedData) {
					if (typeof data === "string") return stdout.push(data)
					return stdout.push(data)
				}
			})
			nmapProcess.stderr.on("data", (data: Buffer | string) => {
				if (Buffer.isBuffer(data)) data = data.toString(resultEncoding)
				if (data.includes("You requested a scan type which requires root privileges.")) {
					if (!userPassword) throw NoPasswordError
					if (opts.args) opts.args.unshift("nmap")
					else opts.args = ["nmap"]
					opts.nmapLocation = "sudo"
					return resolve(this.runNmap(opts))
				}

				const parsedData = this.parseNmapData(data)
				if (parsedData) {
					if (typeof data === "string") return stdout.push(data)
					return stdout.push(data)
				}
			})

			nmapProcess.on("close", (code) => {
				if (stdout.includes("\nQUITTING!\n")) return

				const shouldNetNothing = stdout.map(line => {
					if (line.search(new RegExp(`All \\d+ scanned ports on ${opts.ip} are closed`)) !== -1) return true
					return false
				}).reduce((prev, curr) => prev || curr)
				if (shouldNetNothing) return resolve([])

				const outputLines = stdout
					.map(line => {
						if (line.search("Starting Nmap") !== -1) return ""
						if (line.search("Nmap scan report for") !== -1) return ""
						return line
					}).filter(l => l !== "")[0].split("\n").filter(l => l !== "")
				const hostDown = outputLines
					.map((line) => line.search("Host seems down") !== -1)
					.reduce((curr, acc) => curr || acc)

				const portStart = outputLines
					.map((line, i) => line.search(String.raw`.*PORT\s*STATE\s*SERVICE.*`) !== -1 && i + 1 || 0).reduce((curr, acc) => acc += curr)
				const portEnd = outputLines
					.map((line, i) => line.search("Nmap done") !== -1 && i || 0).reduce((curr, acc) => acc += curr)

				const services = outputLines.slice(portStart, portEnd).map(service => {
					const [port, state, process] = service.split(" ")
					return {
						up: !hostDown,
						port: parseInt(port.split("/")[0]),
						portType: port.split("/")[1] as NmapOutProcessPortType,
						state: state as NmapOutProcessState,
						service: process
					}
				})
				console.log(services)
				resolve(services)
			})
		})
	}
	private parseNmapData(line: string | string[]): string[] {
		if (typeof line === "string") line = line.split("\n")
		line = line.filter((l) => {
			if (l.includes("Starting Nmap")) return
			if (l.includes("Nmap done")) return
			return l
		})
		return line
	}
}