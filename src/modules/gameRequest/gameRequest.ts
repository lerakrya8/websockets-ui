import WebSocket from "ws"
import { AddShipData, AddUserToRoomData, Commands, RequestData } from "../../interfaces/interfaces.ts"
import { addGame, addRoom, addShips, findRoomById } from "../../actions/actions.ts"
import { DATABASE, Sockets } from "../../database/database.ts";
import { v4 as uuidv4 } from 'uuid';

export const handleCreateRoom = () => {
    addRoom();
}

export const handleAddUserToRoom = (data: RequestData) => {
    const roomId = (data as AddUserToRoomData).indexRoom;

    const roomById = findRoomById(roomId);

    if (!roomById) {
        return null; // обработать этот кейс
    }

    const playerInRoomId = roomById.users.at(0)?.id || ''; // обработать случай если нет id

    const playerSocket = Sockets[playerInRoomId];

    const idGame = uuidv4();
    const idPlayerOne = uuidv4();
    const idPlayerTwo = uuidv4();

    const responceOne = {
        type: Commands.START_GAME,
        data: JSON.stringify({
            idGame,
            idPlayerOne,
        }),
        id: 0
    }

    const responceTwo = {
        type: Commands.CREATE_GAME,
        data: JSON.stringify({
            idGame,
            idPlayerTwo,
        }),
        id: 0
    };

    const currentPlayerId = DATABASE.currentPlayer.index;

    const currentPlayerSocket = Sockets[currentPlayerId];

    addGame({gameId: idGame, 
        playerIdOne: idPlayerOne, 
        playerIdTwo: idPlayerTwo, 
        userIdOne: playerInRoomId, 
        userIdTwo: currentPlayerId});

    playerSocket.send(JSON.stringify(responceOne));
    currentPlayerSocket.send(JSON.stringify(responceTwo));
}

export const handleAddShips = (data: RequestData) => {
    const shipsData = data as AddShipData;

    addShips(shipsData);
}

export const handleAttack = (data: RequestData, ws: WebSocket) => {
    console.log(data, ws);
}

export const handleRandomAttack = (data: RequestData, ws: WebSocket) => {
    console.log(data, ws);
}