import React from "react"
import "./app.css"
import Services from "./Pages/Services/Services"
import Navbar from "./Components/Navbar/navbar"
import Login from "./Components/Login/login"
import {
	UserModel,
	useGenerateAuthUrlQuery,
	useLoginMutation,
} from "./generated/graphql"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import { useEffect } from "react"
import ServiceManager from "./Pages/ServiceManager/ServiceManager"
import { setUser } from "./redux/user"
import { setAuthUrl } from "./redux/global"
import { useAppSelector, useAppDispatch } from "./redux/store"

const App = (): JSX.Element => {
	const [{ data: LoginData }, fetchLoginData] = useLoginMutation()
	const [{ data: AuthUrlData }] = useGenerateAuthUrlQuery()
	const user = useAppSelector((state) => state.user)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (LoginData?.Login.user?.discordUserId)
			dispatch(setUser(LoginData.Login.user as UserModel))
	}, [dispatch, LoginData])
	useEffect(() => {
		if (AuthUrlData?.GenerateAuthURL.url)
			dispatch(setAuthUrl({ AuthUrl: AuthUrlData.GenerateAuthURL.url }))
	}, [dispatch, AuthUrlData])

	const pages = new Map<string, string>([
		["Services", "/services"],
		["Service Manager", "/servicemanager"],
	])
	const currentPage = {
		page: "Services",
		location: "/services",
	}
	useEffect(() => {
		if (!user) fetchLoginData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) // this is supposed to be empty because it should only run on load, never after that (since the cookie won't appear magically)

	return (
		<Router>
			<Navbar pages={pages} currentPage={currentPage} />
			<Route exact path="/">
				<Redirect to="/services" />
			</Route>
			<Route path="/authed">
				<Login />
			</Route>
			<Route path="/services">
				<Services />
			</Route>
			<Route path="/servicemanager">
				<ServiceManager />
			</Route>
		</Router>
	)
}

export default App
