import { Grid, Paper, Button, IconButton } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/DeleteRounded"
import { AuthCodeClass, useRemoveAuthCodeMutation } from "src/generated/graphql"

interface AuthCodeProps {
	code: AuthCodeClass,
	updateGrid: () => void
}

const AuthCode: React.FC<AuthCodeProps> = ({code, updateGrid}) => {
	const [, removeAuthCode] = useRemoveAuthCodeMutation()

	const removeSelf = () => {
		removeAuthCode({code: code.code})
		updateGrid()
	}

	return (
		<Grid item xs>
		<Paper style={{maxWidth: 8*64}}>
			<p>Code: {code.code}</p>
			<p>Created at: {new Date(code.createdAt).toLocaleString()}</p>
			<IconButton onClick={removeSelf}>
				<DeleteIcon />
			</IconButton>
		</Paper>
		</Grid>
	)
}
export default AuthCode