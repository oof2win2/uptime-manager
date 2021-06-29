import ReactDOM from "react-dom"
import React from "react"
import { createClient, fetchExchange, Provider } from "urql"
import App from "./app"

const client = createClient({
	url: "http://localhost:5555/graphql",
	exchanges: [fetchExchange],
	fetchOptions: {
		credentials: "include",
		mode: "cors"
	},
})

ReactDOM.render(
	<React.StrictMode>
		<Provider value={client}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
)