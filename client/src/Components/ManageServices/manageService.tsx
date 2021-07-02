import { Grid, Paper, IconButton, Dialog, InputLabel, TextField, MenuItem, Button, Select } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/DeleteRounded"
import EditIcon from '@material-ui/icons/EditRounded'
import { useState } from "react"
import { ModifyServiceMutation, MutationModifyServiceArgs, ServiceClass } from "../../generated/graphql"
import DialogBox from "../DialogBox/DialogBox"
import { useStyles } from "../MaterialUIElements/Themes"
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ManagerServiceProp {
	service: ServiceClass
	deleteService: (id: string) => void
	modifyService: (update: MutationModifyServiceArgs) => void
}

const ManagerService: React.FC<ManagerServiceProp> = ({service, deleteService, modifyService}) => {
	const styles = useStyles()
	const [removeDialog, setRemoveDialog] = useState<JSX.Element|null>(null)
	const [editDialogEnabled, setEditDialogEnabled] = useState(false)
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
	const formValidationSchema = Yup.object().shape({
		serviceName: Yup.string().required("Required"),
		socketType: Yup.string().oneOf(["udp", "tcp"], "Must be one of udp or tcp").required("Required"),
		port: Yup.number().min(0, "Port cannot be negative").max(65535, "Too high number to be a port").required("Required"),
		url: Yup.string().required("URL is required")
	})

	const formik = useFormik({
		initialValues: {
			serviceName: service.name,
			socketType: service.socketType,
			port: service.port.toString(),
			url: service.url
		},
		validationSchema: formValidationSchema,
		onSubmit: ((values) => modifyService({
			name: values.serviceName,
			port: parseInt(values.port),
			socketType: values.socketType,
			url: values.url,
			id: service.id
		}))
	})
	const editDialog = 
	<Dialog open={editDialogEnabled} onClose={() => setEditDialogEnabled(false)}>
		<form onSubmit={formik.handleSubmit} style={{margin: 24}}>
			<InputLabel>Service name</InputLabel>
			<TextField 
				fullWidth
				id="serviceName"
				name="serviceName"
				value={formik.values.serviceName}
				onChange={formik.handleChange}
				error={formik.touched.serviceName && Boolean(formik.errors.serviceName)}
				helperText={formik.touched.serviceName && formik.errors.serviceName}
			/>
			<InputLabel>Service URL</InputLabel>
			<TextField 
				fullWidth
				id="url"
				name="url"
				value={formik.values.url}
				onChange={formik.handleChange}
				error={formik.touched.url && Boolean(formik.errors.serviceName)}
				helperText={formik.touched.url && formik.errors.url}
			/>
			<InputLabel>Service port</InputLabel>
			<TextField
				fullWidth
				id="port"
				name="port"
				type="number"
				value={formik.values.port}
				onChange={formik.handleChange}
				error={formik.touched.port && Boolean(formik.errors.port)}
				helperText={formik.touched.port && formik.errors.port}
			/>
			<InputLabel>Socket type</InputLabel>
			<Select 
				fullWidth
				id="socketType"
				name="socketType"
				label="Socket type"
				value={formik.values.socketType}
				onChange={formik.handleChange}
				error={formik.touched.socketType && Boolean(formik.touched.socketType)}
			>
				<MenuItem value="udp">UDP</MenuItem>
				<MenuItem value="tcp">TCP</MenuItem>
			</Select>
			<Button fullWidth type="submit">
				Update service
			</Button>
		</form>
	</Dialog>

	return (
		<Grid item xs="auto">
		<Paper className={styles.innerPaper} style={{maxWidth: 8*32, minWidth: 8*32, alignItems: "center", marginLeft:8}}>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8, paddingTop:16}}>Service ID: {service.id}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Service name: {service.name}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Service URL: {service.url}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Created at: {new Date(service.createdAt).toLocaleString()}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Socket type: {service.socketType === "udp" ? "UDP" : "TCP"}</p>
			<p className={styles.p} style={{alignSelf: "center", marginLeft: 8}}>Port: {service.port}</p>
			<IconButton onClick={promptRemove} style={{alignSelf: "center"}}>
				<DeleteIcon />
			</IconButton>
			<IconButton onClick={() => setEditDialogEnabled(true)} style={{alignSelf: "center"}}>
				<EditIcon />
			</IconButton>
			{removeDialog}
			{editDialog}
		</Paper>
		</Grid>
	)
}
export default ManagerService