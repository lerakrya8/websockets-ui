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

    console.log(DATABASE.currentPlayer);

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
}

export const addGame = ({playerIdOne, playerIdTwo, gameId, userIdOne, userIdTwo}: AddGameType) => {
   const game: Game = {
        id: gameId,
        players: [
            {
                userId: userIdOne,
                playerId: playerIdOne,
                ships: [],
            }, 
            {
                userId: userIdTwo,
                playerId: playerIdTwo,
                ships: [],
            }
        ]
   };

   DATABASE.game = game;
}

export const addShips = (data: AddShipData) => {
    // const gameId = data.gameId;
    const playerId = data.indexPlayer;
    const ships = data.ships;

    const playerCard = DATABASE.game.players.find(player => player.playerId === playerId);

    if (!playerCard) {
        return null; // обработать случай 
    }

    playerCard.ships = ships;
}
