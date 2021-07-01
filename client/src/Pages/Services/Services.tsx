import { useServicesQuery } from "../../generated/graphql"
import { LinearProgress, Grid, Paper } from "@material-ui/core"
import Service from "../../Components/Service/service"
import useInterval from "@use-it/interval"
import Timer from "src/Components/timer/timer"
import { useStyles } from "src/Components/MaterialUIElements/Themes"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServicesProp {

}

const Services: React.FC<ServicesProp> = () => {
	const [{ fetching, data, error }, fetchServices] = useServicesQuery()
	const classes = useStyles()

	useInterval(() => {
		fetchServices({ requestPolicy: "network-only" })
	}, 60 * 1000)

	if (error?.networkError) return (
		<div style={{ paddingTop: 32, marginLeft: 32, marginRight: 32 }}>
			<h1 className={classes.h1}>A network error occured. Please try again later</h1>
		</div>
	)
	else if (error) return (
		<div style={{ paddingTop: 32, marginLeft: 32, marginRight: 32 }}>
			<h1 className={classes.h1}>An error occured: {error.message}</h1>
		</div>
	)

	if (fetching || !data) return (
		<div style={{ paddingTop: 32, marginLeft: 32, marginRight: 32 }}>
			<LinearProgress />
		</div>
	)

	return (
		<div style={{ paddingTop: 32, marginLeft: 32, marginRight: 32, alignContent: "center", alignItems: "center" }}>
			<Timer from={new Date()} style={{alignContent: "center"}} preString={"Last fetched services"} />
			<Paper className={classes.outerPaper} style={{alignSelf: "center"}} elevation={0}>
				<Grid container spacing={2} direction="column" alignItems="center" justify="center">
					{data?.Services.map(service => <Service key={service.id} id={service.id} />)}
				</Grid>
			</Paper>
		</div>
	)
}
export default Services