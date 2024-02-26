import WebSocket from "ws";
import { DATABASE, Sockets } from "../database/database.ts";
import { AddShipData, Game, Player, RegReqData, UserInRoomType } from "../interfaces/interfaces.ts";
import { v4 as uuidv4 } from 'uuid';

export const addUser = (data: RegReqData, ws: WebSocket) => {
    const id = uuidv4();

    const user: Player = {
        index: id,
        name: data.name,
        password: data.password,
        wins: 0,
    };

    DATABASE.users.push(user);

    DATABASE.currentPlayer = user;

    Sockets[id] = ws;

    return user;
}


export const addRoom = () => {
    const roomId = uuidv4();

    const room = {
        id: roomId,
        users: Array<UserInRoomType>(),
    }

    const userInRoom: UserInRoomType = {
        id: DATABASE.currentPlayer.index,
        name: DATABASE.currentPlayer.name,
    };

    room.users.push(userInRoom);

    DATABASE.rooms.push(room);

    return room;
}

export const findRoomById = (id: string | number) => {
    return DATABASE.rooms.find(room => room.id === id);
}

type AddGameType = {
    playerIdOne: string;
    playerIdTwo: string;
    gameId: string;
    userIdOne: string;
    userIdTwo: string;
    roomId: string;
}

export const addGame = ({playerIdOne, playerIdTwo, gameId, userIdOne, userIdTwo, roomId}: AddGameType) => {
   const game: Game = {
        id: gameId,
        players: [
            {
                userId: userIdOne,
                playerId: playerIdOne,
                ships: [],
                shipField: Array.from({ length: 10 }, () => Array(10).fill({isShip: false, 
                    shipHealthy: {lenght: 0, health: 0, direction: false, shipStart: {x: 0, y: 0}}})),
                shootedCells: [],
                killedShilps: 0,
            }, 
            {
                userId: userIdTwo,
                playerId: playerIdTwo,
                ships: [],
                shipField: Array.from({ length: 10 }, () => Array(10).fill({isShip: false, 
                    shipHealthy: {lenght: 0, health: 0, direction: false, shipStart: {x: 0, y: 0}}})),
                shootedCells: [],
                killedShilps: 0
            }
        ],
        roomId: roomId,
   };

   DATABASE.game.push(game);
}

export const addShips = (data: AddShipData) => {
    const gameId = data.gameId;
    const playerId = data.indexPlayer;
    const ships = data.ships;

    const game = DATABASE.game.find(game => game.id === gameId);

    if (!game) {
        console.log("Something went wrong - Game doesn't exist'");
        return null; 
    }

    const playerCard = game.players.find(player => player.playerId === playerId);

    if (!playerCard) {
        console.log("Something went wrong - Player doesn't exist'");

        return null;  
    }

    playerCard.ships = ships;

    playerCard.ships.forEach(ship => {

        const shipHealth = {lenght: ship.length, health: ship.length, direction: ship.direction, killedShilps: 0, shipStart: {x: ship.position.x, y: ship.position.y}};
        if (ship.direction) {
            let x = ship.position.x;
            for (let y = ship.position.y; y < ship.position.y + ship.length; y++) {

                const cell = {
                    isShip: true,
                    shipHealthy: shipHealth,
                }

                playerCard.shipField[y][x] = cell;
            }

        }

        if (!ship.direction) {
            let y = ship.position.y;
            for (let x = ship.position.x; x < ship.position.x + ship.length; x++) {

                const cell = {
                    isShip: true,
                    shipHealthy: shipHealth,
                }

                playerCard.shipField[y][x] = cell;
            }
        }
    });

}

export const checkShips = (gameId: string) => {
    const game = DATABASE.game.find(game => game.id === gameId);

    if (!game) {
        console.log("Something went wrong - Game doesn't exist'");
        return null; 
    }
    const playerOne = game.players.at(0);

    const playerTwo = game.players.at(1);

    if (!playerOne || !playerTwo) {
        console.log("Something went wrong - Players don't exist'");

        return null; 
    }

    return !!playerOne.ships.length && !!playerTwo.ships.length;
}
