import robot from 'robotjs';

export const drawCircle = (radius: number) => {
  console.log(radius);
  let {x, y} = robot.getMousePos();
  x -= radius;
  for (let i = 0; i <= Math.PI * 2; i += 0.02) {
    const flowingX = x + radius * Math.cos(i);
    const flowingY = y + radius * Math.sin(i);
    robot.dragMouse(flowingX, flowingY);
  }
};
