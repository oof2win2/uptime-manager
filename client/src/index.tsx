import ReactDOM from "react-dom"
import React from "react"
import { createClient, fetchExchange, Provider as UrqlProvider } from "urql"
import ReduxStore from './redux/store'
import { Provider as ReduxProvider } from 'react-redux'

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
		<ReduxProvider store={ReduxStore}>
		<UrqlProvider value={client}>
			<App />
		</UrqlProvider>
		</ReduxProvider>
	</React.StrictMode>,
	document.getElementById("root")
)