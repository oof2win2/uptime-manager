// Example of how to send a request to mark a service as reachable
import fetch from "node-fetch"

// your service id. will be different
const serviceId = "4EkN7GL"

const run = async () => {
	const res = await fetch(
		`http://localhost:5555/services/setstatus/${serviceId}`,
		{
			method: "POST",
		}
	).then((r) => r.json())

	// {"status":"OK","message":"Service status updated"}
}
run()
