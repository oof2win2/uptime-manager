import React from "react"
import { LogClass, useServiceWithLogsQuery } from "src/generated/graphql"
import { CircularProgress } from "@material-ui/core"
import Day from "./day"
import Current from "./current"
import "./service.css"
import ReactTooltip from 'react-tooltip'


const Service: React.FC<{ id: string }> = ({ id }: { id: string }) => {
	const [{fetching, data}] = useServiceWithLogsQuery({ variables: { id: id } })

	if (fetching) return (
		<>
			<CircularProgress />
		</>
	)
	console.log(data)
	if (!data || !data.ServiceWithLogs) return (
		<>Error fetching service with ID of {id}</>
	)
	const days = new Map<string, Array<LogClass>>()
	data.ServiceWithLogs.logs.forEach(log => {
		const createdAtDate = new Date(log.createdAt)
		const created = days.get(createdAtDate.toDateString())
		if (created) {
			created.push(log)
			return days.set(createdAtDate.toDateString(), created)
		} else {
			return days.set(createdAtDate.toDateString(), [log])
		}
	})

	let latestDate: {time: number, log?: LogClass} = { time: 0 }
	data.ServiceWithLogs.logs.forEach(log => {
		if (log.createdAt > latestDate.time) latestDate = { time: log.createdAt, log: log }
	})
	if (!latestDate.log) latestDate.log = data.ServiceWithLogs.logs[0]


	return (
		<div className="serviceBlock">
			<p style={{ marginRight: "10px", marginTop: 12, paddingRight: 10 }}>{data.ServiceWithLogs.name}</p>
			<svg width={19.8*Array.from(days.entries()).length} height={32} style={{ display: "inline-block", paddingTop: 5 }}>
				{Array.from(days.entries()).map((data, i) => {
					const logs = data[1]
					return <Day logs={logs} pos={i} key={i} />
				})}
			</svg>
			<Current log={latestDate.log}/>
			<ReactTooltip place="bottom" class="tooltip" html={true} />
		</div>
	)
}
export default Service