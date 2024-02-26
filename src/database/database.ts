import WebSocket from "ws";
import { Game, Player, Room } from "../interfaces/interfaces";

interface DatabaseInterface {
    rooms: Room[];
    users: Player[];
    currentPlayer: Player;
    game: Game[];
}

export const DATABASE: DatabaseInterface = {
    rooms: [],
    users: [],
    currentPlayer: {
        index: '',
        name: '',
        password: '',
        wins: 0
    },
    game: [],
};

export const Sockets: Record<string, WebSocket> = {}
