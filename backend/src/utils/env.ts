import { cleanEnv, str, url, port, num } from "envalid"
import dotenv from "dotenv"

dotenv.config({
	path: "../.env",
})

const ENV = cleanEnv(process.env, {
	DISCORD_CLIENTID: str({
		docs: "https://discord.com/developers/docs/topics/oauth2",
	}),
	DISCORD_CLIENTSECRET: str({
		docs: "https://discord.com/developers/docs/topics/oauth2",
	}),
	DISCORD_REDIRECTURI: url({
		docs: "https://discord.com/developers/docs/topics/oauth2",
	}),
	EXPRESS_PORT: port({ default: 5555 }),
	WS_PORT: port({ default: 5556 }),
	SESSION_SECRET: str(),
	FRONTEND_URL: url({ desc: "The URL to your frontend" }),
	SUDO_PASSWORD: str({ desc: "Sudo user password for UDP nmap (nmap -sU)" }),
	NMAP_THREAD_COUNT: num({
		desc: "The amount of simultaneous nmap instances that can run",
		default: 8,
	}),
	DB_URL: url({
		desc: "file: URL for the database, path is relative from src/prisma/schema.prisma",
		example: "file:../../database.sqlite",
	}),
})
export default ENV
