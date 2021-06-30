import { AppBar, Toolbar, IconButton, Link, Button } from "@material-ui/core"
import { useEffect } from "react"
import { useLogoutMutation } from "src/generated/graphql"
import { useAppDispatch, useAppSelector } from "src/redux/store"
import { logoutUser } from "src/redux/user"

const Navbar: React.FC<{
	pages: Map<string, string>,
	currentPage: Record<"page" | "location", string>,
}> = ({ pages, currentPage }: {
	pages: Map<string, string>,
	currentPage: Record<"page" | "location", string>,
}) => {
	const user = useAppSelector((state) => state.user)
	const AuthUrl = useAppSelector((state) => state.global.AuthUrl)
	const [{data: LogoutData}, LogoutDatabase] = useLogoutMutation()
	const dispatch = useAppDispatch()

	const logout = () => {
		LogoutDatabase()
	}
	useEffect(() => {
		dispatch(logoutUser())
	}, [dispatch, LogoutData])
 
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