import robot from 'robotjs';

export const mouse_up = (coordY: number) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouseSmooth(x, y - coordY);
};

export const mouse_down = (coordY: number) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouseSmooth(x, y + coordY);
};

export const mouse_left = (coordX: number) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouseSmooth(x - coordX, y);
};

export const mouse_right = (coordX: number) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouseSmooth(x + coordX, y);
};
