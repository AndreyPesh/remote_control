import Jimp from 'jimp';
import { httpServer } from './http_server/server';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { mouse_up, mouse_down, mouse_left, mouse_right } from './utils/mouseMove';
import { Action } from './types/enum';
import { INVALID_COMMAND } from './constant/message';

const HTTP_PORT = 3000;
const SOCKET_PORT = 8080;

const socketServer = new WebSocketServer({ port: SOCKET_PORT });

socketServer.on('connection', (ws) => {
  console.log(`Start websocket on the ${SOCKET_PORT} port!`);

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
      default: {
        console.log(INVALID_COMMAND);
      }
    }
    if (coordFirst) {
      ws.send(`${command}\0`);
    }
  });
});

socketServer.on('close', () => {
  console.log('server closed');
  process.exit();
});

process.on('SIGINT', () => {
  socketServer.close();
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});
