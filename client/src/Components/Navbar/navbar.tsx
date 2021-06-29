import { useState } from "react"
import { AppBar, Toolbar, IconButton, Link } from "@material-ui/core"
import { UserClass, AuthUrl } from "src/generated/graphql"

const Navbar: React.FC<{
	pages: Map<string, string>,
	currentPage: Record<"page" | "location", string>,
	onClick: (event: React.MouseEvent<HTMLElement>) => void,
	user: UserClass|null,
	authUrlData?: AuthUrl
}> = ({ pages, currentPage, onClick, user, authUrlData }: {
	pages: Map<string, string>,
	currentPage: Record<"page" | "location", string>,
	onClick: (event: React.MouseEvent<HTMLElement>) => void,
	user: UserClass|null
	authUrlData?: AuthUrl
}) => {
		return (
			<AppBar position={"static"}>
				<Toolbar>
					{Array.from(pages.entries()).map(([page, location], i) => {
						if (currentPage.location === location && currentPage.page === page) {
							return (
								<Link href={location} onClick={onClick} color="secondary" key={i}>
									<IconButton>{page}</IconButton>
								</Link>
							)
						}
						return (
							<Link href={location} onClick={onClick} color="primary" key={i}>
								<IconButton>{page}</IconButton>
							</Link>
						)
					})}
					{user ? <p>Logged in</p>
						: <Link href={authUrlData?.url}><IconButton>Log in</IconButton></Link>
					}
				</Toolbar>
			</AppBar>
		)
	}
export default Navbar