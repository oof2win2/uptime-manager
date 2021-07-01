import { Grid, Paper, IconButton } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/DeleteRounded"
import { useState } from "react"
import { ServiceClass } from "../../generated/graphql"
import DialogBox from "../DialogBox/DialogBox"
import { useStyles } from "../MaterialUIElements/Themes"

interface ManagerServiceProp {
	service: ServiceClass
	deleteService: (id: string) => void
}

const ManagerService: React.FC<ManagerServiceProp> = ({service, deleteService}) => {
	// TODO: finish removal
	const styles = useStyles()
	const [removeDialog, setRemoveDialog] = useState<JSX.Element|null>(null)
	const removeSelf = () => {
		deleteService(service.id)
	}
	const promptRemove = () => {
		setRemoveDialog(
			<DialogBox
				title={`Remove service ${service.name}?`}
				ContentText={`Are you sure you want to remove the service ${service.name}? This process will irreversibly remove this service and its logs`}
				cancel="Cancel"
				confirm="Confirm"
				onConfirm={removeSelf}
				onCancel={() => setRemoveDialog(null)}
			/>
		)
	}

	return (
		<Grid item xs="auto">
		<Paper className={styles.innerPaper} style={{maxWidth: 8*32, minWidth: 8*32, alignItems: "center", marginLeft:8}}>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8, paddingTop:16}}>Service ID: {service.id}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Service name: {service.name}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Service URL: {service.url}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Created at: {new Date(service.createdAt).toLocaleString()}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Socket type: {service.socketType}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Port: {service.port}</p>
			<IconButton onClick={promptRemove} style={{alignSelf: "center"}}>
				<DeleteIcon />
			</IconButton>
			{removeDialog}
		</Paper>
		</Grid>
	)
}
export default ManagerService