import React from "react"
import "./app.css"
import Services from "./Pages/Services/Services"
import Navbar from "./Components/Navbar/navbar"
import Login from "./Components/Login/login"
import { useSignupOrLoginMutation, UserClass, useGenerateAuthUrlQuery, useLoginMutation } from "./generated/graphql"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useState } from "react"
import { useEffect } from "react"

const App = (): JSX.Element => {
	const [user, setUser] = useState<UserClass | null>(null)
	const [{ data: SignupData }] = useSignupOrLoginMutation()
	const [{ data: LoginData, fetching: LoginFetching, error }, fetchLoginData] = useLoginMutation()
	const [{ data: AuthUrlData }] = useGenerateAuthUrlQuery()
	const pages = new Map<string, string>([
		["Services", "/services"]
	])
	const currentPage = {
		page: "Services",
		location: "/services"
	}
	const onNavbarClick = (evt: React.MouseEvent<HTMLElement>) => {
		console.log(evt.currentTarget)
	}

	if (SignupData?.SignupOrLogin.user) setUser(SignupData.SignupOrLogin.user as UserClass)
	if (LoginData?.Login.user) setUser(LoginData.Login.user as UserClass)

	return (
		<Router>
			<Navbar pages={pages} currentPage={currentPage} onClick={onNavbarClick} user={user} authUrlData={AuthUrlData?.GenerateAuthURL} />
			<Route exact path="/">
				<Redirect to="/services" />
			</Route>
			<Route path="/authed">
				<Login setUser={setUser} />
			</Route>
			<Route path="/services">
				<Services />
			</Route>
		</Router>
	)
}

export default App