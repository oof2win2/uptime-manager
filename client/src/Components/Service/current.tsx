import React, { Fragment, CSSProperties } from "react"
import { LogModel } from "src/generated/graphql"
import { useStyles } from "../MaterialUIElements/Themes"
import "./current.css"

interface CurrentProps {
	log?: LogModel
	style?: CSSProperties
}

const Current: React.FC<CurrentProps> = ({ log, style }: CurrentProps) => {
	const classes = useStyles()
	const online = log?.reachable || false
	const calculateColor = (): string => {
		const minColor = "#fc1505"
		const maxColor = "#05fc19"
		return log?.reachable ? maxColor : minColor
	}
	return (
		<Fragment>
			<p style={style} className={classes.p}>
				Current status: {online ? "Online" : "Unreachable"}
			</p>
			<svg
				width={24}
				height={24}
				style={{ marginTop: 14, marginLeft: 5, ...style }}
			>
				<circle r={12} fill={calculateColor()} cx={12} cy={12}></circle>
			</svg>
		</Fragment>
	)
}
export default Current
