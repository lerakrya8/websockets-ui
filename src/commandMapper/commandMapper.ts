import { Commands } from "../interfaces/interfaces.ts";
import { handleAddShips, handleAddUserToRoom, handleAttack, handleCreateRoom, handleRandomAttack } from "../modules/gameRequest/gameRequest.ts";
import { handleRegCommand } from "../modules/personalRequest/player.ts";

export const commandsMapper = {
    [Commands.REG]: handleRegCommand,
    [Commands.CREATE_ROOM]: handleCreateRoom,
    [Commands.ADD_USER_TO_ROOM]: handleAddUserToRoom,
    [Commands.ADD_SHIPS]: handleAddShips,
    [Commands.ATTACK]: handleAttack,
    [Commands.RANDOM_ATTACK]: handleRandomAttack,
}