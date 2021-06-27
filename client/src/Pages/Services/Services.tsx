import { useServicesQuery } from "../../generated/graphql"
import { LinearProgress } from "@material-ui/core"
import Service from "../../Components/Service/service"

interface ServicesProp {

}

const Services: React.FC<ServicesProp> = ({ }) => {
	const [{ fetching, data }] = useServicesQuery()
	if (fetching || !data) return (
		<div>
			<LinearProgress />
		</div>
	)
	return (
		<div>
			{data.Services.map(service => <Service key={service.id} id={service.id} />)}
		</div>
	)
}
export default Services