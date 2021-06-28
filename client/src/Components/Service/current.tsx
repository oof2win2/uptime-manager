import React from "react"
import { LogClass } from "src/generated/graphql"
import "./current.css"
import Timer from "../timer/timer"

const Current: React.FC<{log: LogClass}> = ({log}: {log: LogClass}) => {
	const online = log.reachable
	const calculateColor = (): string => {
		const minColor = "#fc1505"
		const maxColor = "#05fc19"
		return log.reachable ? maxColor : minColor
	}
	return (
		<>
		<p>Current status: {online ? "Online" : "Unreachable"}</p>
		<svg width={24} height={24} style={{paddingTop: 14, paddingLeft: 5}}>
			<circle r={12} fill={calculateColor()} cx={12} cy={12}></circle>
		</svg>
		</>
	)
}
export default Current