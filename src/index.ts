import Jimp from 'jimp';
import { httpServer } from './http_server/server';
import robot from 'robotjs';
import WebSocket, { WebSocketServer } from 'ws';
import { mouse_up, mouse_down, mouse_left, mouse_right } from './utils/mouseMove';
import { Action } from './types/enum';
import { INVALID_COMMAND, SOCKET_CLOSE } from './constant/message';
import { drawCircle } from './utils/draw';

const HTTP_PORT = 3000;
const SOCKET_PORT = 8080;
const socketServer = new WebSocketServer({ port: SOCKET_PORT });

const clients: Set<WebSocket> = new Set();

socketServer.on('connection', (ws) => {
  console.log(`Start websocket on the ${SOCKET_PORT} port!`);
  clients.add(ws);
  ws.on('message', (data) => {
    const [command, coordFirst, coordSecond] = data.toString().split(' ');
    switch (command) {
      case Action.up: {
        mouse_up(Number(coordFirst));
        break;
      }
      case Action.down: {
        mouse_down(Number(coordFirst));
        break;
      }
      case Action.left: {
        mouse_left(Number(coordFirst));
        break;
      }
      case Action.right: {
        mouse_right(Number(coordFirst));
        break;
      }
      case Action.position: {
        const { x, y } = robot.getMousePos();
        ws.send(`${command} ${x},${y}`);
        break;
      }
      case Action.circle: {
        drawCircle(Number(coordFirst));
        break;
      }
      default: {
        console.log(INVALID_COMMAND);
      }
    }
    if (coordFirst) {
      ws.send(`${command}`);
    }
  });
});

socketServer.on('close', () => {
  console.log(SOCKET_CLOSE + ` ${SOCKET_PORT} port!`);
  process.exit();
});

process.on('SIGINT', () => {
  clients.forEach((client) => client.close());
  socketServer.close();
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});
