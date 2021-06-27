import { useServicesQuery } from "../../generated/graphql.d"
import { CircularProgress } from "@material-ui/core"

interface ServicesProp {

}

const Services: React.FC<ServicesProp> = ({ }) => {
	const [{ fetching, data }] = useServicesQuery()
	if (fetching) return (
		<div>
			<CircularProgress />
		</div>
	)
	console.log(data)
	return (
		<div>
			Got the data.
		</div>
	)
}
export default Services