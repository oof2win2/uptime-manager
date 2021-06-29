import React from "react"
import "./app.css"
import Services from "./Pages/Services/Services"
import Navbar from "./Components/Navbar/navbar"
import Login from "./Components/Login/login"
import { useSignupOrLoginMutation, UserClass, useGenerateAuthUrlQuery, useLoginMutation } from "./generated/graphql"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useEffect } from "react"
import ServiceManager from "./Pages/ServiceManager/ServiceManager"
import { setUser } from "./redux/user"
import { useAppSelector, useAppDispatch } from "./redux/store"
import { useDispatch } from "react-redux"

const App = (): JSX.Element => {
	const [{ data: LoginData }, fetchLoginData] = useLoginMutation()
	const [{ data: AuthUrlData }] = useGenerateAuthUrlQuery()
	const pages = new Map<string, string>([
		["Services", "/services"],
		["Service Manager", "/servicemanager"]
	])
	const currentPage = {
		page: "Services",
		location: "/services"
	}
	useEffect(() => {
		if (!user) fetchLoginData()
	}, [])
	const user = useAppSelector((state) => state.user)
	const dispatch = useDispatch()
	if (LoginData?.Login.user?.discordUserId)
		dispatch(setUser(LoginData.Login.user as UserClass))
	// if (AuthUrlData?.GenerateAuthURL.url)

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