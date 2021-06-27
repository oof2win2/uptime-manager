import React, { Fragment } from "react"
import { ServiceClass, LogClass } from "src/generated/graphql"
import {  getColorFromDataGradient } from "@philipbaker4/color-utilities"
import "./current.css"
import ReactDOMServer from 'react-dom/server'

const Current: React.FC<{log: LogClass}> = ({log}: {log: LogClass}) => {
	const online = log.reachable
	const timeString = new Date(log.createdAt).toDateString()
	const calculateColor = (): string => {
		const minColor = "#fc1505"
		const maxColor = "#05fc19"
		return log.reachable ? maxColor : minColor
	}
	return (
		<>
		<p>Current status: {online ? "Online" : "Unreachable"}</p>
		<p className="circle" style={{backgroundColor: calculateColor(), marginLeft: 16}}></p>
		</>
	)
}
export default Current