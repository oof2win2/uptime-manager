import { useEffect } from "react"
import { Snackbar, LinearProgress } from "@material-ui/core"
import { UserClass, useSignupOrLoginMutation } from "src/generated/graphql"
import { Redirect } from "react-router"
import { setUser } from "src/redux/user"
import { useAppDispatch } from "src/redux/store"

const Login: React.FC = () => {
	const [{ data: SignupData, fetching }, SignupOrLogin] = useSignupOrLoginMutation()
	const dispatch = useAppDispatch()
	const url = new URL(window.location.href)
	const URLQuery = new URLSearchParams(url.search)
	if (URLQuery.get("code") && URLQuery.get("state") && !fetching && !SignupData) {
		SignupOrLogin({
			AccessToken: URLQuery.get("code") as string,
			State: URLQuery.get("state") as string,
		})
	}
	useEffect(() => {
		dispatch(setUser(SignupData?.SignupOrLogin.user as UserClass))
	}, [dispatch, SignupData?.SignupOrLogin.user])

	if (fetching) return (
		<div style={{paddingTop: 32}}>
			<LinearProgress />
			<p>Authorizing...</p>
		</div>
	)

	const user = SignupData?.SignupOrLogin.user

	if (SignupData?.SignupOrLogin.errors) {
		console.log("should show snackbar error", SignupData.SignupOrLogin)
		return (
			<div>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				autoHideDuration={5000}
				message={`Error logging in: ${SignupData.SignupOrLogin.errors[0].error}`}
			/>
			<Redirect to="/" />
			</div>
		)
	}

	if (user) {
		return (
			<div>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				autoHideDuration={5000}
				message="You have been successfully logged in"
			/>
			<Redirect to="/" />
			</div>
		)
	}

	return (
		<div style={{paddingTop: 32}}>
			<p>Logging in...</p>
		</div>
	)
}
export default Login