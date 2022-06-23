import 'dotenv/config';
import { httpServer } from './http_server/server';
import robot from 'robotjs';
import WebSocket, { WebSocketServer, createWebSocketStream } from 'ws';
import { mouse_up, mouse_down, mouse_left, mouse_right } from './utils/mouseMove';
import { Action } from './types/enum';
import { INVALID_COMMAND, SOCKET_CLOSE } from './constant/message';
import { drawCircle, drawRectangle, drawSquare } from './utils/draw';
import { getScreenShot } from './utils/picture';

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 8080;
const socketServer = new WebSocketServer({ port: Number(SOCKET_PORT) });

const clients: Set<WebSocket> = new Set();

socketServer.on('connection', (ws) => {
  console.log(`Client connected on ${SOCKET_PORT} port!`);
  clients.add(ws);
  const duplex = createWebSocketStream(ws, { decodeStrings: false });

  duplex.on('data', (data) => {
    try {
      const [command, coordFirst, coordSecond] = data.toString().trim().split(' ');
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
          duplex.write(`${command} ${x},${y}`);
          break;
        }
        case Action.circle: {
          drawCircle(Number(coordFirst));
          break;
        }
        case Action.rectangle: {
          drawRectangle(Number(coordFirst), Number(coordSecond));
          break;
        }
        case Action.square: {
          drawSquare(Number(coordFirst));
          break;
        }
        case Action.screen: {
          getScreenShot()
            .then((image) => {
              duplex.write(`${command} ${image}`);
            })
            .catch((err) => console.log(err));
          break;
        }
        default: {
          console.log(INVALID_COMMAND);
        }
      }
      if (coordFirst) {
        duplex.write(`${command}`);
      }
    } catch (error) {
      console.log(error);
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
  console.log(`Websocket server available on the ${SOCKET_PORT} port!`);
});
