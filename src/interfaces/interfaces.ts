export type RequestType = 
|'reg' 
| 'update_winners' 
| 'create_room' 
| 'add_user_to_room' 
| 'create_game' 
| 'update_room' 
| 'add_ships'  
| 'start_game'  
| 'attack' 
| 'randomAttack'
| 'turn'
| 'finish';

export enum IncomingCommands {
    REG = 'reg',
    CREATE_ROOM = 'create_room',
    ADD_USER = 'add_user_to_room',
    ADD_SHIPS = 'add_ships',
    ATTACK = 'attack',
    RANDOM_ATTACK = 'randomAttack',
}

export enum Commands {
    REG = 'reg',
    UPDATE_WINNERS = 'update_winners',
    CREATE_ROOM = 'create_room',
    ADD_USER_TO_ROOM = 'add_user_to_room',
    CREATE_GAME = 'create_game',
    UPDATE_ROOM = 'update_room',
    ADD_SHIPS = 'add_ships',
    START_GAME = 'start_game',
    ATTACK = 'attack',
    RANDOM_ATTACK = 'randomAttack',
    TURN = 'turn',
    FINISH = 'finish',
}

export interface Player {
    index: string;
    name: string;
    password: string;
    wins: number;
}

export type UserInRoomType = {
    id: string;
    name: string;
}

export interface Room {
    id: string;
    users: UserInRoomType[]; 
}

type ShipField = {
    isShip: boolean;
    shipHealthy: {
        lenght: number;
        health: number;
        direction: boolean;
        shipStart: {
            x: number;
            y: number;
        }
    }
}

export interface PlayerInGame {
    userId: string;
    playerId: string;
    ships: Ship[];
    shipField: ShipField[][];
    shootedCells: {
        x: number;
        y: number;
    }[];
    killedShilps: number;
}

export interface Game {
    id: string;
    roomId: string;
    players: PlayerInGame[]; 
}

export interface RegReqData {
    name: string;
    password: string;
}

export interface RegOutData {
    name: string;
    index: number | string;
    error: boolean;
    errorText: string;
}

export type UpdateWinnersData = {
    name: string;
    wins: number;
}[];

export interface AddUserToRoomData {
    indexRoom: string;
}

export type CreateNewRoomData = string;

export interface CreateGameData {
    idGame: number | string;
    idPlayer: number | string;
}

export interface RoomUser {
    name: string;
    index: number | string;
}

export type UpdateRoomData = {
    roomId: number | string;
    roomUsers: RoomUser[];           
}[];

export type ShipTypeType = 'small' | 'medium' | 'large' | 'huge';
export type PositionType = {
    x: number;
    y: number;
}

export interface Ship {
    position: PositionType;
    direction: boolean;
    length: number;
    type: ShipTypeType;
}

export interface AddShipData {
    gameId: string;
    ships: Ship[];
    indexPlayer: number | string;
}

export interface StartGameData {
    ships: Ship[];
    currentPlayerIndex: number | string;
}

export interface AttackData {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: number | string;
}

export type AttackStatusType = 'miss' | 'killed' | 'shot';

export interface AttackFeedbackData {
    position: PositionType;
    currentPlayer: number | string;
    status: AttackStatusType;
}

export interface RandomAttackData {
    gameId: number | string;
    indexPlayer: number | string;
}

export interface TurnData {
    currentPlayer: number | string;
}

export interface FinishData {
    winPlayer: number | string;
}

export type RequestData = 
RegReqData | 
RegOutData |
UpdateWinnersData |
AddUserToRoomData | 
CreateNewRoomData |
CreateGameData |
UpdateRoomData |
AddShipData |
StartGameData |
AttackData |
AttackFeedbackData |
RandomAttackData |
TurnData |
FinishData;

export interface Data {
    type: RequestType;
    data: RequestData;
    id: number;
}