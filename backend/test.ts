import dotenv from "dotenv"
dotenv.config({
	path: "./.env"
})
import { Client } from '@2pg/oauth';

const client = new Client({
  id: process.env.DISCORD_CLIENTID as string,
  secret: process.env.DISCORD_CLIENTSECRET as string,
  redirectURI: process.env.DISCORD_REDIRECTURI as string,
  scopes: ['identify']
});
const run = async () => {
	console.log(client.authCodeLink)
	const key = await client.getAccess("IoTKLzC7rKdBWQIL2eiw7TUc8nXSaS");

	const user = await client.getUser(key); // { id: '...', username: 'ADAMJR', ... }
	console.log(user)
}
run()