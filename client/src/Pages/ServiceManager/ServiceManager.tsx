import { useAppSelector } from "src/redux/store"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceManagerProp {

}

const ServiceManager: React.FC<ServiceManagerProp> = () => {
	const user = useAppSelector((state) => state.user)
	return (
		<div>Hi there {user ? user.discordUsername : "No name. Log in."}</div>
	)
}
export default ServiceManager