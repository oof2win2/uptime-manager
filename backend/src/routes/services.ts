import { Router } from "express"
import { param, validationResult } from "express-validator"
import prisma from "../utils/database"
import PostLogChecker from "../utils/PostLogChecker"

const router = Router()

router.post(
	"/setstatus/:serviceid",
	param("serviceid").isString().escape(),
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty)
			return res.status(400).json({ errors: errors.array() })

		const serviceid = req.params?.["serviceid"]
		if (!serviceid) return res.status(400).json({})

		const service = await prisma.service.findFirst({
			where: {
				id: serviceid,
			},
		})
		if (!service)
			return res.status(400).json({
				errors: [
					{
						location: "params",
						msg: "Invalid service ID",
						param: "serviceid",
					},
				],
			})

		await prisma.log.create({
			data: {
				reachable: true,
				serviceId: service.id,
			},
		})

		PostLogChecker.Update(service.id)

		return res
			.status(200)
			.json({ status: "OK", message: "Service status updated" })
	}
)

export default router
