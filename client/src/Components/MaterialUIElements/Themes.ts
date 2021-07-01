import { createMuiTheme, makeStyles } from "@material-ui/core"
// there once existed themeLight...
export const themeDark = createMuiTheme({
	palette: {
		primary: {
			main: "#1e88e5",
			light: "#6ab7ff",
			dark: "#005cb2",
			contrastText: "#ffffff"
		},
		secondary: {
			main: "#7b1fa2",
			light: "#ae52d4",
			dark: "#4a0072",
			contrastText: "#ffffff"
		},
		background: {
			default: "#182528",
			paper: "#263438"
			// default: "#263438",
			// paper: "#182528"
		}
	},
	typography: {
		fontFamily: [
			"--apple-system",
			"Roboto",
			"Open Sans"
		].join(","),
		fontSize: 16
	},
})

export const useStyles = makeStyles({
	root: {
		background: themeDark.palette.background.default,
	},
	p: {
		color: "#ddd7d7" // this nicely contrasts the background & not same as heading
	},
	h1: {
		color: "#ffffff"
	},
	outerPaper: {
		color: "#162428",
		backgroundColor: themeDark.palette.background.paper,
	},
	innerPaper: {
		backgroundColor: "#1a353d"
	},
	divider: {
		color: "#ffffff"
	},
	button: {
		color: "#ffffff"
	}
})