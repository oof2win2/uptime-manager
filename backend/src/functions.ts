export function getUserID(string: string): string {
	const startBuf = Buffer.alloc(2, string.slice(2, 6), "hex")
	const endBuf = Buffer.alloc(3, string.slice(18), "hex")
	const start = startBuf.toString("base64").slice(0, -1) // remove first char as doesn't change often enough, last two and == as those change too often
	const end = endBuf.toString("base64")
	return start + end
}