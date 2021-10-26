import React from "react"
import { LogModel } from "src/generated/graphql"
import { getColorFromDataGradient } from "@philipbaker4/color-utilities"
import "./day.css"
import ReactDOMServer from "react-dom/server"

const Day: React.FC<{ logs: LogModel[]; pos: number }> = ({
	logs,
	pos,
}: {
	logs: LogModel[]
	pos: number
}) => {
	const percentageOnline = `${
		Math.round(
			(logs.filter((log) => log.reachable).length / logs.length) *
				100 *
				10
		) / 10
	}%`
	const timeString = new Date(logs[0].createdAt).toDateString()
	const avgPing =
		logs.map((log) => log.ping).reduce((a, b) => a + b) / logs.length
	const dataTooltip = ReactDOMServer.renderToString(
		<div>
			<p
				style={{
					font: "Open Sans",
					fontFamily: "sans-serif",
					fontSize: 20,
					textAlign: "left",
					marginBottom: 0,
				}}
			>
				{percentageOnline} up
			</p>
			<p style={{ paddingTop: 0 }}>{timeString}</p>
			<p style={{ paddingTop: 0 }}>Average ping: {avgPing}</p>
		</div>
	)
	const calculateColor = (): string => {
		const numberReachable = logs.filter((log) => log.reachable).length
		const minColor = "#fc1505"
		const maxColor = "#05fc19"
		const grad = getColorFromDataGradient(
			minColor,
			0,
			maxColor,
			logs.length,
			logs.length,
			numberReachable ? numberReachable - 1 : numberReachable
		)
		return grad as string
	}
	return (
		<rect
			height={30}
			width={12}
			x={pos * 19.8}
			y={1}
			fill={calculateColor()}
			className="dayRect"
			rx={6}
			ry={6}
			data-tip={dataTooltip}
		></rect>
	)
}
export default Day
