import ReactDOM from "react-dom"
import React from "react"
import { createClient, fetchExchange, Provider as UrqlProvider } from "urql"
import ReduxStore from "./redux/store"
import { Provider as ReduxProvider } from "react-redux"

import App from "./app"
import { ThemeProvider, CssBaseline } from "@material-ui/core"
import { themeDark } from "./Components/MaterialUIElements/Themes"

const client = createClient({
	url: "http://localhost:5555/graphql",
	exchanges: [fetchExchange],
	fetchOptions: {
		credentials: "include",
		mode: "cors",
	},
})

const Index = () => {
	return (
		<React.StrictMode>
			<ReduxProvider store={ReduxStore}>
				<ThemeProvider theme={themeDark}>
					<UrqlProvider value={client}>
						<CssBaseline />
						<App />
					</UrqlProvider>
				</ThemeProvider>
			</ReduxProvider>
		</React.StrictMode>
	)
}

ReactDOM.render(<Index />, document.getElementById("root"))
