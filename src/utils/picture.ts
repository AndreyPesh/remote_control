import robot from 'robotjs';
import Jimp from 'jimp';
import { ENCODE_BASE64, SIZE_PICTURE, START_POS } from '../constant/number';

const getBase64FromBuffer = async (image: Jimp): Promise<string> => {
  const imageBase64 = await image.getBufferAsync(Jimp.MIME_PNG);
  return imageBase64.toString(ENCODE_BASE64);
};

export const getBufferImage = (): Promise<Jimp> => {
  const { x, y } = robot.getMousePos();
  const robotScreenPic = robot.screen.capture(x, y, SIZE_PICTURE, SIZE_PICTURE);
  return new Promise((resolve, reject) => {
    try {
      const image = new Jimp(robotScreenPic.width, robotScreenPic.height);
      const { width, height, data } = image.bitmap;
      let pos = START_POS;
      image.scan(START_POS, START_POS, width, height, (x, y, idx) => {
        data[idx + 2] = robotScreenPic.image.readUInt8(pos++);
        data[idx + 1] = robotScreenPic.image.readUInt8(pos++);
        data[idx + 0] = robotScreenPic.image.readUInt8(pos++);
        data[idx + 3] = robotScreenPic.image.readUInt8(pos++);
      });
      resolve(image);
    } catch (error) {
      reject(error);
    }
  });
};

export const getScreenShot = async (): Promise<string | null> => {
  try {
    const imageBuffer = await getBufferImage();
    const imageBase64 = await getBase64FromBuffer(imageBuffer);
    return imageBase64;
  } catch (error) {
    console.log(error);
    return null;
  }
};
