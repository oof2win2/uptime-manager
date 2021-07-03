import nmapWrapper from "./nmapWrapper"

const run = async () => {
	const nmap = new nmapWrapper({
		maxScanTime: 60*1000,
		userPassword: "githubec"
	})
	nmap.runNmap({
		ip: "83.87.74.240",
		args: ["-p 80"],
	}).then(console.log)
}
run()