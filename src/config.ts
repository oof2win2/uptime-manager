import mongoose from "mongoose"

interface GlobalConfig {
	mongooseURI: string
	mongooseOpts: mongoose.ConnectOptions

	expressPort: number
}

const config: GlobalConfig = {
	mongooseURI: "mongodb+srv://dbUser:iQZxuImIr7qW9H3o@cluster0.k3lnx.mongodb.net/uptime",
	mongooseOpts: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	},

	expressPort: 5555,
}
export default config