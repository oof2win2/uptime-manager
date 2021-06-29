import React, {Fragment, CSSProperties} from "react"
import { LogClass } from "src/generated/graphql"
import "./current.css"

const Current: React.FC<{log: LogClass, style?: CSSProperties}> = ({log, style}: {log: LogClass, style?: CSSProperties}) => {
	const online = log.reachable
	const calculateColor = (): string => {
		const minColor = "#fc1505"
		const maxColor = "#05fc19"
		return log.reachable ? maxColor : minColor
	}
	return (
		<Fragment>
		<p style={style}>Current status: {online ? "Online" : "Unreachable"}</p>
		<svg width={24} height={24} style={{paddingTop: 14, paddingLeft: 5, ...style}}>
			<circle r={12} fill={calculateColor()} cx={12} cy={12}></circle>
		</svg>
		</Fragment>
	)
}
export default Current