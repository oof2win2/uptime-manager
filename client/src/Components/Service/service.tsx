import React from "react"
import { LogModel, useServiceWithLogsQuery } from "src/generated/graphql"
import { CircularProgress, Grid, Paper } from "@material-ui/core"
import Day from "./day"
import Current from "./current"
import "./service.css"
import ReactTooltip from "react-tooltip"
import { useStyles } from "../MaterialUIElements/Themes"

const getDatesBetween = (startDate: Date, endDate: Date) => {
	const dates: Date[] = []
	// Strip hours minutes seconds etc.
	let currentDate = new Date(
		startDate.getFullYear(),
		startDate.getMonth(),
		startDate.getDate()
	)
	while (currentDate <= endDate) {
		dates.push(currentDate)
		currentDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() + 1 // Will increase month if over range
		)
	}
	return dates
}

interface ServiceProps {
	id: number
}

const Service: React.FC<ServiceProps> = ({ id }) => {
	const [{ fetching, data }] = useServiceWithLogsQuery({
		variables: { id: id },
	})
	const classes = useStyles()

	if (fetching)
		return (
			<Grid item xs="auto">
				<CircularProgress />
			</Grid>
		)
	if (!data || !data.ServiceWithLogs)
		return (
			<Grid item xs="auto">
				<p>Error fetching service with ID of {id}</p>
			</Grid>
		)
	const days = new Map<number, Array<LogModel>>()

	const pushToDays = (log: LogModel) => {
		const createdAtDate = new Date(log.createdAt)
		const created = days.get(
			new Date(createdAtDate.toDateString()).valueOf()
		)
		if (created) {
			created.push(log)
			return days.set(
				new Date(createdAtDate.toDateString()).valueOf(),
				created
			)
		} else {
			return days.set(new Date(createdAtDate.toDateString()).valueOf(), [
				log,
			])
		}
	}
	data.ServiceWithLogs.logs.forEach(pushToDays)

	// this is for if the service has been running for less than 30 days
	const DAYS_COUNT = 31
	if (Array.from(days.keys()).length < DAYS_COUNT) {
		const now = new Date()
		const oneMonthAgo = new Date()
		oneMonthAgo.setDate(oneMonthAgo.getDate() - DAYS_COUNT)
		oneMonthAgo.setHours(0, 0, 0, 0)
		while (oneMonthAgo.getMonth() === now.getMonth()) {
			oneMonthAgo.setDate(oneMonthAgo.getDate() - 1)
		}
		now.setHours(0, 0, 0, 0)

		if (!days.get(oneMonthAgo.valueOf()))
			days.set(oneMonthAgo.valueOf(), [
				{
					reachable: false,
					serviceId: id,
					id: 0,
					createdAt: oneMonthAgo,
					ping: 0,
				},
			])
		if (!days.get(now.valueOf()))
			days.set(now.valueOf(), [
				{
					reachable: false,
					serviceId: id,
					id: 0,
					createdAt: now,
					ping: 0,
				},
			])

		let Dates = Array.from(days.keys())
			.sort((a, b) => a.valueOf() - b.valueOf())
			.map((a) => new Date(a))
		Dates.forEach((date) => {
			// remove dates that are beyond 30 days ago or in the future
			if (date.valueOf() < oneMonthAgo.valueOf())
				days.delete(date.valueOf())
			if (date.valueOf() > now.valueOf()) days.delete(date.valueOf())
		})
		Dates = Array.from(days.keys())
			.sort((a, b) => a.valueOf() - b.valueOf())
			.map((a) => new Date(a))

		let filledDates: Date[] = []
		Dates.forEach((date, i) => {
			const nextDate = Dates[i + 1]
			if (!nextDate) return
			const datesBetween = getDatesBetween(date, nextDate).slice(0, -1)
			filledDates.push(...datesBetween)
		})
		filledDates = filledDates.filter((date) => {
			if (days.get(date.valueOf())) return false
			if (date.valueOf() < oneMonthAgo.valueOf()) return false
			return true
		})
		filledDates.forEach((date) => {
			days.set(date.valueOf(), [
				{
					createdAt: date,
					serviceId: id,
					reachable: false,
					id: 0,
					ping: 0,
				},
			] as LogModel[])
		})
	}

	let latestDate: { time: number; log?: LogModel } = { time: 0 }
	data.ServiceWithLogs.logs.forEach((log) => {
		if (new Date(log.createdAt).valueOf() > latestDate.time)
			latestDate = { time: new Date(log.createdAt).valueOf(), log: log }
	})
	if (!latestDate.log)
		latestDate.log = {
			createdAt: Date.now(),
			serviceId: id,
			reachable: false,
			id: 0,
			ping: 0,
		} as LogModel

	return (
		<Grid item xs="auto" justify="flex-end">
			<Paper
				style={{
					marginLeft: -16,
					marginRight: -16,
					paddingLeft: 16,
					paddingRight: 16,
				}}
				className={classes.innerPaper}
			>
				<Grid>
					<p className={classes.p}>{data.ServiceWithLogs.name}</p>
					<svg
						width={19.8 * Array.from(days.entries()).length}
						height={32}
						style={{ display: "inline" }}
					>
						{Array.from(days.entries())
							.sort((a, b) => a[0] - b[0])
							.map((data, i) => {
								const logs = data[1]
								return <Day logs={logs} pos={i} key={i} />
							})}
					</svg>
					<Current
						log={latestDate.log}
						style={{ display: "inline" }}
					/>
				</Grid>
				<ReactTooltip place="bottom" class="tooltip" html={true} />
			</Paper>
		</Grid>
	)
}
export default Service
