import { AppBar, Toolbar, IconButton, Link, Button } from "@material-ui/core"
import { AuthUrl, useLogoutMutation } from "src/generated/graphql"
import { useAppSelector } from "src/redux/store"

const Navbar: React.FC<{
	pages: Map<string, string>,
	currentPage: Record<"page" | "location", string>,
}> = ({ pages, currentPage }: {
	pages: Map<string, string>,
	currentPage: Record<"page" | "location", string>,
}) => {
	const user = useAppSelector((state) => state.user)
	const AuthUrl = useAppSelector((state) => state.global.AuthUrl)
	const [, LogoutDatabase] = useLogoutMutation()

	const logout = () => {
		LogoutDatabase()
	}
 
	return (
		<AppBar position={"static"}>
			<Toolbar>
				{Array.from(pages.entries()).map(([page, location], i) => {
					if (currentPage.location === location && currentPage.page === page) {
						return (
							<Link href={location} color="secondary" key={i}>
								<IconButton>{page}</IconButton>
							</Link>
						)
					}
					return (
						<Link href={location} color="primary" key={i}>
							<IconButton>{page}</IconButton>
						</Link>
					)
				})}
				{user ? <Button onClick={logout} style={{float: "right"}}><IconButton>Log out</IconButton></Button>
					: <Button href={AuthUrl}><IconButton>Log in</IconButton></Button>
				}
			</Toolbar>
		</AppBar>
	)
	}
export default Navbar