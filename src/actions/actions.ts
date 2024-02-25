import { DATABASE } from "../database/database.ts";
import { Player, RegReqData } from "../interfaces/interfaces.ts";
import { v4 as uuidv4 } from 'uuid';

export const addUser = (data: RegReqData) => {
    const id = uuidv4();

    const user: Player = {
        index: id,
        name: data.name,
        password: data.password,
        wins: 0
    };

    DATABASE.players.push(user);

    return user;
}