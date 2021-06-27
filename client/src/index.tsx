import ReactDOM from "react-dom"
import React, { useEffect, useState } from "react"
import { createClient, Provider } from "urql"
import "./index.css"
import Services from "./Pages/Services/Services"

const client = createClient({ url: "http://localhost:5555/graphql" })

const App = () => {
	return (
		<Provider value={client}>
			<div className="app">
				<Services />
			</div>
		</Provider>
	)
}
ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
)