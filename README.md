# uptime-manager
An open-source uptime manager

![Service status display](https://i.imgur.com/AvHlcPz.png)
![Editing a service](https://i.imgur.com/zCwSzxF.png)

## Features
- A 30-day past data display with % of uptime per day
- Checking whether users are administrators
- Authentication through Discord's OAuth
- Authentication codes to not let everybody access your services and modify then

## Installation

### Prerequisites:
- [Node](https://nodejs.org/en/) (version 14), [yarn v2](https://yarnpkg.com/getting-started/install)
- [serve](https://www.npmjs.com/package/serve) installed globally (`npm i -g serve`)

1. Create a Discord app at [the developer app page](https://discord.com/developers/applications)
   1. Create the app
   2. Go to the OAuth2 page of your app
   3. Add a redirect URL for Discord to understand. Set it to `${your app's URL}/authed`, e.g. `http://localhost:3000/authed`
   4. Copy the client ID and client secret for the next step
2. Create a .env file in the corresponding folders according to the two examples in backend/ and client/. Add in the client ID and secret from the previous step
3. In the root folder, run `yarn install` to install dependencies shared with both apps
4. In both the `client` and `backend` folders, run `yarn download`
5. To run `backend`, simply run `npm start` in the `backend` folder. To run `client`, simply run `serve -s build/` in the `client` folder

## Development
This code is open-source and licenced under MIT. I would be very happy if you would want to contribute to this! You will need dev dependencies (`yarn install -D`) and typescript, or whatever you do to run typescript. When pushing, please lint with `yarn lint`. It will fix auto-fixable issues but you may need to interact with harder stuff.


## TODO:
- [ ] Add a way to remotely fetch services instead of API-only currently
- [ ] Add proper CSS to the frontend so services look the same
- [ ] Make all elements use the theme
- [ ] Add a light theme?