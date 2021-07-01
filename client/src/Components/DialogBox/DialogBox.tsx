import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"

interface AlertDialogProps {
	ContentText: string
	title: string
	cancel: string
	confirm: string
	onCancel: () => void
	onConfirm: () => void
}

export default function AlertDialog(props: AlertDialogProps): JSX.Element {
	return (
		<Dialog
			open={true}
			onClose={props.onCancel}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{props.ContentText}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onCancel} color="primary">{props.cancel}</Button>
				<Button onClick={props.onConfirm} color="primary" autoFocus>{props.confirm}</Button>
			</DialogActions>
		</Dialog>
	)
}