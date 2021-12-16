import { createCanvas, loadImage, Image } from 'canvas';
import fs from 'fs';
import Color from 'color';

interface Options {
  maxWidth?: number;
  maxHeight?: number;
  sourceImagePath: string | null;
}

export class Pixelization {
  options: Options = {
    sourceImagePath: null,
  };

  sourceImagePath = '';

  constructor(option: Options) {
    this.options = option;
    if (option.sourceImagePath === null) throw new Error('You must add a correct file URL');
    this.sourceImagePath = option.sourceImagePath;
  }

  async reduceImage() {
    const inputImage = await loadImage(`${__dirname}/${this.sourceImagePath}`);
    // const image = jpeg.decode(inputStreamFile);
    const outputStreamFile = fs.createWriteStream(`${__dirname}/graphique.png`);

    const canvas = createCanvas(inputImage.width, inputImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(inputImage, 0, 0);
    const white = Color([255, 255, 255]);

    ctx.fillStyle = white.hex();
    ctx.rect(200, 200, 300, 300);

    ctx.fill();
    const stream = canvas.createPNGStream();
    stream.pipe(outputStreamFile);
  }
}
