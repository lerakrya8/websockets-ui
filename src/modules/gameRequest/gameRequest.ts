import WebSocket from "ws"
import { RequestData } from "../../interfaces/interfaces"

export const handleCreateRoom = (data: RequestData, ws: WebSocket) => {
    console.log(data, ws);
}

export const handleAddUser = (data: RequestData, ws: WebSocket) => {
    console.log(data, ws);
}

export const handleAddShips = (data: RequestData, ws: WebSocket) => {
    console.log(data, ws);
}

export const handleAttack = (data: RequestData, ws: WebSocket) => {
    console.log(data, ws);
}

export const handleRandomAttack = (data: RequestData, ws: WebSocket) => {
    console.log(data, ws);
}