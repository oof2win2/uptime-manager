import {
	AuthCodeModel,
	useCreateAuthCodeMutation,
	useGetAuthCodesQuery,
	useRemoveAuthCodeMutation,
} from "src/generated/graphql"
import { CircularProgress, Grid, Button } from "@material-ui/core"
import AuthCode from "./AuthCode"
import { useEffect } from "react"
import { useStyles } from "../MaterialUIElements/Themes"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AuthCodesProps {}

const AuthCodes: React.FC<AuthCodesProps> = () => {
	const [
		{ data: AuthCodesData, fetching: AuthCodesFetching },
		refetchAllCodes,
	] = useGetAuthCodesQuery()
	const [{ fetching: AuthCodesCreateFetching }, createAuthCode] =
		useCreateAuthCodeMutation()
	const [{ fetching: AuthCodesRemovingFetching }, removeAuthCode] =
		useRemoveAuthCodeMutation()

	const styles = useStyles()

	useEffect(() => {
		// for when auth codes are created
		// console.log("creating", AuthCodesCreateFetching)
		if (!AuthCodesCreateFetching) refetchAllCodes()
	}, [AuthCodesCreateFetching, refetchAllCodes])
	useEffect(() => {
		// for when auth codes are revoked
		// console.log("removing", AuthCodesRemovingFetching)
		if (!AuthCodesRemovingFetching) refetchAllCodes()
	}, [AuthCodesRemovingFetching, refetchAllCodes])

	const removeCode = (code: string) => removeAuthCode({ code: code })

	const createCode = (
		<Button
			onClick={() => {
				createAuthCode()
			}}
		>
			<p className={styles.p}>Create an auth code</p>
		</Button>
	)

	if (AuthCodesFetching)
		return (
			<div>
				<CircularProgress />
			</div>
		)

	if (!AuthCodesData)
		return (
			<div>
				<p> className={styles.p}An error has occured.</p>
			</div>
		)
	if (AuthCodesData.getAuthCodes.errors)
		return (
			<div>
				<p className={styles.p}>
					An error has occured:{" "}
					{AuthCodesData.getAuthCodes.errors[0].error}
				</p>
			</div>
		)

	const codes = AuthCodesData.getAuthCodes.codes as AuthCodeModel[]

	if (!codes.length)
		return (
			<div>
				<p className={styles.p}>No existing auth codes</p>
				{createCode}
			</div>
		)

	return (
		<div>
			<Grid
				container
				spacing={2}
				direction="row"
				alignItems="center"
				justify="center"
			>
				{codes.map((code, i) => (
					<AuthCode code={code} removeAuthCode={removeCode} key={i} />
				))}
			</Grid>
			{createCode}
		</div>
	)
}
export default AuthCodes
