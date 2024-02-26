import WebSocket from "ws";
import { addUser } from "../../actions/actions.ts";
import { Data, RegReqData, RequestData } from "../../interfaces/interfaces.ts";
import { sendRoomUpdate, sendUpdateWinners } from "../afterAllRequest/afterAllRequest.ts";

export const handleRegCommand = (data: RequestData, ws: WebSocket) => {
    const user = addUser(data as RegReqData, ws);

    const responceData = JSON.stringify({
        name: user.name,
        index: user.index,
        error: false,
        errorText: '',

    });

    const responce: Data = {
        type: 'reg',
        data: responceData,
        id: 0,
    };

    ws.send(JSON.stringify(responce));
    sendRoomUpdate(ws);
    sendUpdateWinners(ws);
}
