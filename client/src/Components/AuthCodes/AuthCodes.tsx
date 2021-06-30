import { AuthCodeClass, useCreateAuthCodeMutation, useGetAuthCodesQuery } from "src/generated/graphql"
import { CircularProgress, Grid, Button } from "@material-ui/core"
import AuthCode from "./AuthCode"
import { useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AuthCodesProps {

}

const AuthCodes: React.FC<AuthCodesProps> = () => {
	const [creatingCode, setCreatingCode] = useState(false)
	const [{ data: AuthCodesData, fetching: AuthCodesFetching }, refetchAllCodes] = useGetAuthCodesQuery()
	const [, createAuthCode] = useCreateAuthCodeMutation()

	if (creatingCode) {
		refetchAllCodes()
		setCreatingCode(false)
	}
	const createCode =
		<Button onClick={() => {createAuthCode(); setCreatingCode(true)}}>
			<p>Create an auth code</p>
		</Button>

	if (AuthCodesFetching) return (
		<div>
			<CircularProgress />
		</div>
	)

	if (!AuthCodesData) return (
		<div>
			<p>An error has occured.</p>
		</div>
	)
	if (AuthCodesData.getAuthCodes.errors) return (
		<div>
			<p>An error has occured: {AuthCodesData.getAuthCodes.errors[0].error}</p>
		</div>
	)

	const codes = AuthCodesData.getAuthCodes.codes as AuthCodeClass[]

	if (!codes.length) return (
		<div>
			<p>No existing auth codes</p>
			{createCode}
		</div>
	)

	return (
		<div>
			<Grid container spacing={2} direction="row" alignItems="center" justify="center">
				{codes.map((code, i) => <AuthCode code={code} updateGrid={refetchAllCodes} key={i} />)}
			</Grid>
			{createCode}
		</div>
	)
}
export default AuthCodes