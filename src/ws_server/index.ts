import {WebSocketServer} from 'ws';
// import { addUser } from '../actions/actions.ts';
// import { DATABASE } from '../database/database.ts';
import { commandsMapper } from '../commandMapper/commandMapper.ts';
import { Commands } from '../interfaces/interfaces.ts';

const WS_PORT = 3000;

const wss = new WebSocketServer({port: WS_PORT});


wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
  
    ws.on('message', function message(data) {
      console.log(wss.clients.size);
      const jsonData = JSON.parse(data.toString());

      const requestType: Commands = jsonData.type;

      commandsMapper[requestType](JSON.parse(jsonData.data), ws);

      // func(jsonData.data, ws);



      // wss.clients.forEach(function each(client) {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(data, { binary: isBinary });
      //   }
      // });
    });
});
