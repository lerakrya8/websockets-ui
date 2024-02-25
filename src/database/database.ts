import { Player } from "../interfaces/interfaces";

interface DatabaseInterface {
    roomsId: number[];
    players: Player[];
}

export const DATABASE: DatabaseInterface = {
    roomsId: [],
    players: []
};
