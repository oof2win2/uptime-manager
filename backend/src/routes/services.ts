import { Router } from "express"
import { param, validationResult } from 'express-validator';
import LogModel from "../database/types/Logs";
import ServiceModel from "../database/types/Service";
import PostLogChecker from "../helpers/PostLogChecker";

const router = Router()

router.post("/setstatus/:serviceid",
	param("serviceid").isString().escape(),
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty)
			return res.status(400).json({ errors: errors.array() })
		
		const serviceid = req.params?.["serviceid"]
		if (!serviceid) return res.status(400).json({})

		const service = await ServiceModel.findOne({id: serviceid})
		if (!service) return res.status(400).json({
			errors: [{
				location: "params",
				msg: "Invalid service ID",
				param: "serviceid"
			}]
		})

		const log = await LogModel.create({
			reachable: true,
			createdAt: Date.now(),
			serviceId: service._id
		})

		service.logs.push(log._id)
		await service.save()
		
		PostLogChecker.Update(service)

		return res.status(200).json({status: "OK", message: "Service status updated"})
	})

export default router