import find from "find-process"
import dgram from "dgram"
import https from "https"
import lsofi from "lsofi"

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const run = async () => {
	const socket = dgram.createSocket({type: "udp4"})
	socket.bind(25565)
	find("port", 55555).then(console.log)
	const server = https.createServer((req, res) => console.log(req, res))
	server.listen(5555)

	console.log("created")
	await wait(1000)
	lsofi(25566).then(console.log)
}
run()