import useInterval from "@use-it/interval"
import { useState } from "react"

function timeDiffCalc(dateFuture: number, dateNow: number): string {
	let diffInSeconds = Math.abs(dateFuture - dateNow) / 1000;
	// calculate days
	const days = Math.floor(diffInSeconds / 86400);
	diffInSeconds -= days * 86400;
	// calculate hours
	const hours = Math.floor(diffInSeconds / 3600) % 24;
	diffInSeconds -= hours * 3600;
	// calculate minutes
	const minutes = Math.floor(diffInSeconds / 60) % 60;
	diffInSeconds -= minutes * 60;
	// calculate seconds
	const seconds = Math.floor(diffInSeconds)
	let difference = '';
	if (days > 0)
		difference += (days > 0) ? `${days} days, ` : `${days} day, `;
	if (hours > 0)
		difference += (hours > 0) ? `${hours} hours, ` : `${hours} hour, `;
	if (minutes > 0)
		difference += (seconds > 0) ? `${minutes} minutes, ` : `${minutes} minutes`
	if (seconds) difference += `${seconds} seconds`
	return difference;
}

const Timer: React.FC<{ from: Date, preString: string }> = ({ from, preString }: { from: Date, preString: string }) => {
	const [dateString, setDateString] = useState<string>(`${preString} now`)
	useInterval(() => {
		const timeDiffString = timeDiffCalc(Date.now(), from.valueOf())
		setDateString(`${preString} ${timeDiffString} ago`)
	}, 1000)
	return (
		<p>{dateString}</p>
	)
}
export default Timer