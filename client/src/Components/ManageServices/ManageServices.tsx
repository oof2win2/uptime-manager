import {
	useCreateServiceMutation,
	useServicesQuery,
	useDeleteServiceMutation,
	ServiceModel,
	useModifyServiceMutation,
	MutationModifyServiceArgs,
} from "src/generated/graphql"
import {
	Grid,
	LinearProgress,
	Button,
	TextField,
	Dialog,
	Select,
	MenuItem,
	InputLabel,
} from "@material-ui/core"
import ManagerService from "./manageService"
import { useEffect } from "react"
import { useStyles } from "../MaterialUIElements/Themes"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ManageServicesProp {}

const ManageServices: React.FC<ManageServicesProp> = () => {
	const [{ data: Services, fetching: FetchingServices }, fetchServices] =
		useServicesQuery()
	const [{ fetching: CreatingService }, createService] =
		useCreateServiceMutation()
	const [{ fetching: DeletingService }, deleteService] =
		useDeleteServiceMutation()
	const [{ fetching: UpdatingService }, updateService] =
		useModifyServiceMutation()
	const [creatingService, setCreatingService] = useState(false)

	const styles = useStyles()

	useEffect(() => {
		// when service is created
		if (!CreatingService) {
			fetchServices()
			setCreatingService(false)
		}
	}, [CreatingService, fetchServices])
	useEffect(() => {
		// when service is deleted
		if (!DeletingService) fetchServices()
	}, [DeletingService, fetchServices])
	useEffect(() => {
		if (!UpdatingService) fetchServices()
	}, [UpdatingService, fetchServices])

	const removeService = (id: number) => {
		deleteService({ id: id })
	}
	const updateServiceWrap = (update: MutationModifyServiceArgs) => {
		updateService(update)
	}
	const formValidationSchema = Yup.object().shape({
		serviceName: Yup.string().required("Required"),
		socketType: Yup.string()
			.oneOf(["udp", "tcp"], "Must be one of udp or tcp")
			.required("Required"),
		port: Yup.number()
			.min(0, "Port cannot be negative")
			.max(65535, "Too high number to be a port")
			.required("Required"),
		url: Yup.string().required("URL is required"),
		postUpdating: Yup.boolean().required("postUpdating is required"),
	})

	const formik = useFormik({
		initialValues: {
			serviceName: "",
			socketType: "",
			port: "0",
			url: "",
			postUpdating: "false",
		},
		validationSchema: formValidationSchema,
		onSubmit: (values) => {
			createService({
				name: values.serviceName,
				url: values.url,
				port: parseInt(values.port),
				socketType: values.socketType,
				postUpdating: values.postUpdating == "true" ? true : false,
			})
		},
	})

	const createServiceForm = (
		<Dialog
			open={creatingService}
			onClose={() => setCreatingService(false)}
		>
			<form onSubmit={formik.handleSubmit} style={{ margin: 24 }}>
				<InputLabel>Service name</InputLabel>
				<TextField
					fullWidth
					id="serviceName"
					name="serviceName"
					value={formik.values.serviceName}
					onChange={formik.handleChange}
					error={
						formik.touched.serviceName &&
						Boolean(formik.errors.serviceName)
					}
					helperText={
						formik.touched.serviceName && formik.errors.serviceName
					}
				/>
				<InputLabel>Service URL</InputLabel>
				<TextField
					fullWidth
					id="url"
					name="url"
					value={formik.values.url}
					onChange={formik.handleChange}
					error={
						formik.touched.url && Boolean(formik.errors.serviceName)
					}
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
					error={
						formik.touched.socketType &&
						Boolean(formik.touched.socketType)
					}
				>
					<MenuItem value="udp">UDP</MenuItem>
					<MenuItem value="tcp">TCP</MenuItem>
				</Select>
				<InputLabel>POST updating</InputLabel>
				<Select
					fullWidth
					id="postUpdating"
					name="postUpdating"
					label="POST updating"
					value={formik.values.postUpdating}
					onChange={formik.handleChange}
					error={
						formik.touched.postUpdating &&
						Boolean(formik.touched.postUpdating)
					}
				>
					<MenuItem value="true">Yes</MenuItem>
					<MenuItem value="false">No</MenuItem>
				</Select>
				<Button fullWidth type="submit">
					Create service
				</Button>
			</form>
		</Dialog>
	)

	if (FetchingServices || CreatingService || DeletingService)
		return (
			<div>
				<LinearProgress />
			</div>
		)
	if (!Services?.Services)
		return (
			<div>
				<p className={styles.p}>An error has occured.</p>
			</div>
		)

	const services = Services.Services as ServiceModel[]
	if (!services.length)
		return (
			<div>
				<p className={styles.p}>No services to display</p>
				<Button
					onClick={() => {
						setCreatingService(true)
					}}
				>
					<p className={styles.p}>Create a service</p>
				</Button>
				{createServiceForm}
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
				{services.map((service, i) => (
					<ManagerService
						service={service}
						key={i}
						deleteService={removeService}
						modifyService={updateServiceWrap}
					/>
				))}
			</Grid>
			<Button
				onClick={() => {
					setCreatingService(true)
				}}
			>
				<p className={styles.p}>Create a service</p>
			</Button>
			{createServiceForm}
		</div>
	)
}
export default ManageServices
