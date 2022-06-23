import robot from 'robotjs';
import { SHIFT_MOUSE } from '../constant/number';

export const mouse_up = (coordY: number) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouseSmooth(x, y - coordY - SHIFT_MOUSE);
};

export const mouse_down = (coordY: number) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouseSmooth(x, y + coordY + SHIFT_MOUSE);
};

export const mouse_left = (coordX: number) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouseSmooth(x - coordX - SHIFT_MOUSE, y);
};

export const mouse_right = (coordX: number) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouseSmooth(x + coordX + SHIFT_MOUSE, y);
};
