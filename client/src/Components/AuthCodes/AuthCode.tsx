import { Grid, Paper, IconButton } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/DeleteRounded"
import { AuthCodeClass } from "src/generated/graphql"
import { useStyles } from "../MaterialUIElements/Themes"

interface AuthCodeProps {
	code: AuthCodeClass,
	removeAuthCode: (code: string) => void
}

const AuthCode: React.FC<AuthCodeProps> = ({code, removeAuthCode}) => {
	const styles = useStyles()
	const removeSelf = () => {
		removeAuthCode(code.code)
	}

	return (
		<Grid item xs="auto">
		<Paper className={styles.innerPaper} style={{maxWidth: 8*32, minWidth: 8*32}}>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8, paddingTop:16}}>Code: {code.code}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Created at: {new Date(code.createdAt).toLocaleString()}</p>
			<IconButton onClick={removeSelf} style={{alignSelf: "center"}}>
				<DeleteIcon />
			</IconButton>
		</Paper>
		</Grid>
	)
}
export default AuthCode