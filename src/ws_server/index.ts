import {WebSocketServer} from 'ws';

import { commandsMapper } from '../commandMapper/commandMapper.ts';
import { IncomingCommands } from '../interfaces/interfaces.ts';
import { sendRoomUpdate, sendUpdateWinners } from '../modules/afterAllRequest/afterAllRequest.ts';

const WS_PORT = 3000;

const wss = new WebSocketServer({port: WS_PORT});

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
  
    ws.on('message', function message(data) {      
      const jsonData = JSON.parse(data.toString());

      const requestType: IncomingCommands = jsonData.type;

      const func = commandsMapper[requestType];

      func(jsonData.data ? JSON.parse(jsonData.data) : '', ws);
      // Send only if user not in a room with somebody
      sendRoomUpdate(ws);

      sendUpdateWinners(ws);

    });
});
