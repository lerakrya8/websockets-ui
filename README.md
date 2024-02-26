# RSSchool NodeJS websocket task template
> Static http server(connect to the port 8181). 
> By default WebSocket client tries to connect to the 3000 port.

## Installation
1. Clone/download repo
2. `npm install`

## Usage
**Development**

`npm run start:dev`

* App served @ `http://localhost:8181`

**Production**

`npm run start`

* App served @ `http://localhost:8181`

---

**All commands**

Command | Description
--- | ---
`npm run start:dev` | App served @ `http://localhost:8181` 
`npm run start` | App served @ `http://localhost:8181`

Open `http://localhost:8181` and enjoy the BattleShip Game!

(To start the game, it's important to be two persons in a room. When thw room will be full, you will have an oppotunity to put in order your ships. After both players do it, the game will be started).
**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.
