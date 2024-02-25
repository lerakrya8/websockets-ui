import WebSocket from "ws";
import { Commands, Data } from "../../interfaces/interfaces.ts";
import { DATABASE } from "../../database/database.ts";

export const sendRoomUpdate = (ws: WebSocket) => {
    const rooms = DATABASE.rooms;

    const responceData = rooms.map(room => {
        const players = room.users;

        const roomUsers = players.map(player => ({
            name: player.name,
            index: player.id,
        }))
        return (
            {
                roomId: room.id,
                roomUsers,
            }
        )
    })

    const responce: Data = {
        type: Commands.UPDATE_ROOM,
        data: JSON.stringify(responceData),
        id: 0,
    };

    ws.send(JSON.stringify(responce));
}

export const sendUpdateWinners = (ws: WebSocket) => {
    const players = DATABASE.users;

    const sortedPlayersByWins = players.filter(player => player.wins > 0).sort((a, b) => a.wins < b.wins ? 1 : -1);

    const responceData = sortedPlayersByWins.map(player => ({
        name: player.name,
        wins: player.wins,
    }));

    const responce = {
        type: Commands.UPDATE_WINNERS,
        data: JSON.stringify(responceData),
        id: 0,
    };

    ws.send(JSON.stringify(responce));
}