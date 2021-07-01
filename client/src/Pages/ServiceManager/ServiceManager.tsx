import { ChangeEvent } from "react"
import { useHistory } from "react-router"
import { useAppSelector } from "src/redux/store"
import { Button, IconButton, Divider, Grid, TextField, CircularProgress } from "@material-ui/core"
import RefreshIcon from '@material-ui/icons/Refresh';
import { useState } from "react"
import { useAllowWriteAccessMutation } from "src/generated/graphql"

import AuthCodes from "../../Components/AuthCodes/AuthCodes"
import ManageServices from "../../Components/ManageServices/ManageServices"
import { useStyles } from "src/Components/MaterialUIElements/Themes";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceManagerProp {

}

const ServiceManager: React.FC<ServiceManagerProp> = () => {
	const user = useAppSelector((state) => state.user)
	const [code, setCode] = useState("")
	const [{ data: AllowAccessData, fetching: AllowAccessFetching }, allowWriteAccess] = useAllowWriteAccessMutation()
	const styles = useStyles()

	const history = useHistory()
	const headBack = () => {
		history.goBack()
	}

	if (!user) return (
		<div style={{marginLeft: 16}}>
			<p className={styles.p}>Hey there! You are not logged in, so there is nothing here for you.</p>
			<p className={styles.p}>Please log in with Discord or head back</p>
			<Grid container alignItems="center">
				<Button onClick={headBack}><IconButton>
					<p className={styles.p}>Head back</p>	
				</IconButton></Button>
			</Grid>
		</div>
	)

	const inputCode = () => {
		if (!code) return
		allowWriteAccess({
			discordUserId: user.discordUserId,
			code: code
		})
	}

	if (AllowAccessFetching) return (
		<div style={{marginLeft: 16}}>
			<p className={styles.p}>Hey there! You don't have write access, so you might not be here correctly</p>
			<p className={styles.p}>You can either attempt to get write access with a code, or you can head back</p>
			<Grid container alignItems="center">
				<Button
					onClick={headBack}
				><IconButton>Head back</IconButton></Button>
				<Divider orientation="vertical" flexItem style={{ marginLeft: 16, marginRight: 16 }} />
				<CircularProgress />
			</Grid>
		</div>
	)
	if (AllowAccessData) {
		const resetProcess = () => {
			allowWriteAccess()
		}

		let AccessDataMessage;
		if (AllowAccessData.AllowWriteAccess.user)
			AccessDataMessage = <p className={styles.p}>Successfully enabled write access with code</p>
		else if (AllowAccessData.AllowWriteAccess.errors) {
			const error = AllowAccessData.AllowWriteAccess.errors[0]
			if (error.error.includes("code is an invalid access code"))
				AccessDataMessage = <p className={styles.p}>Provided access code is invalid</p>
			else {
				console.error(error)
				AccessDataMessage = <p className={styles.p}>An unknown error occured.</p>
			}
		} else {
			console.error(AllowAccessData)
			AccessDataMessage = <p className={styles.p}>An unknown error occured.</p>
		}

		return (
			<div style={{marginLeft: 16}}>
				<p className={styles.p}>Hey there! You don't have write access, so you might not be here correctly</p>
				<p className={styles.p}>You can either attempt to get write access with a code, or you can head back</p>
				<Grid container alignItems="center">
					<Button
						onClick={headBack}
					><IconButton>Head back</IconButton></Button>
					<Divider orientation="vertical" flexItem style={{ marginLeft: 16, marginRight: 16 }} />
					{AccessDataMessage}
					<IconButton onClick={resetProcess}>
						<RefreshIcon />
					</IconButton>
				</Grid>
			</div>
		)
	}


	if (!user || !user.allowWriteAccess) return (
		<div style={{marginLeft: 16}}>
			<p className={styles.p}>Hey there! You don't have write access, so you might not be here correctly</p>
			<p className={styles.p}>You can either attempt to get write access with a code, or you can head back</p>
			<Grid container alignItems="center">
				<Button
					onClick={headBack}
				><IconButton>Head back</IconButton></Button>
				<Divider orientation="vertical" flexItem style={{ marginLeft: 16, marginRight: 16 }} />
				<TextField
					label="Your code"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
				/>
				<Button
					onClick={inputCode}
				><IconButton>Input code</IconButton></Button>
			</Grid>
		</div>
	)

	return (
		<div style={{marginLeft: 16}}>
			<ManageServices />
			<Divider style={{marginTop: 32, marginBottom: 32}} light={false} variant="inset" />
			<AuthCodes />
			<Divider style={{marginTop: 32, marginBottom: 32}} light={false} />
		</div>
	)
}
export default ServiceManager