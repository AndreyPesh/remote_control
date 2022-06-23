import robot from 'robotjs';
import { mouse_down, mouse_left, mouse_right, mouse_up } from './mouseMove';

export const drawCircle = (radius: number) => {
  const { x, y } = robot.getMousePos();
  const startX = x - radius;
  robot.mouseToggle('down');
  for (let i = 0; i <= Math.PI * 2; i += 0.02) {
    const flowingX = startX + radius * Math.cos(i);
    const flowingY = y + radius * Math.sin(i);
    robot.dragMouse(flowingX, flowingY);
  }
  robot.mouseToggle('up');
};

export const drawRectangle = (width: number, height: number) => {
  robot.mouseToggle('down');
  mouse_down(height);
  mouse_left(width);
  mouse_up(height);
  mouse_right(width);
  robot.mouseToggle('up');
};

export const drawSquare = (side: number) => {
  drawRectangle(side, side);
};
