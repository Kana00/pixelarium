import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
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

  getAverageChunkColor(ctx: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number) {
    const pixelData = ctx.getImageData(sx, sy, sw - sx, sh - sy);
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(sx, sy, sw - sx, sh - sy);

    let averageColor = [pixelData.data[0], pixelData.data[1], pixelData.data[2], pixelData.data[3]];
    console.log('averageColor', averageColor);

    for (let i = 0; i < pixelData.data.length; i += 4) {
      const R1 = averageColor[0];
      const G1 = averageColor[1];
      const B1 = averageColor[2];
      const A1 = averageColor[3];

      const R2 = pixelData.data[i];
      const G2 = pixelData.data[i + 1];
      const B2 = pixelData.data[i + 2];
      const A2 = pixelData.data[i + 3];

      averageColor = [
        Math.sqrt((Math.pow(R1, 2) + Math.pow(R2, 2)) / 2),
        Math.sqrt((Math.pow(G1, 2) + Math.pow(G2, 2)) / 2),
        Math.sqrt((Math.pow(B1, 2) + Math.pow(B2, 2)) / 2),
        Math.sqrt((Math.pow(A1, 2) + Math.pow(A2, 2)) / 2)
      ];

    }

    // const color = `rgba(${averageColor[0]},${averageColor[1]},${averageColor[2]},${averageColor[3] / 255})`;
    const color = Color(averageColor);
    console.log('color : ', color);
    ctx.fillStyle = color.hex();
    ctx.fillRect(sx, sy, sw - sx, sh - sy);
  }

  async reduceImage() {
    const inputImage = await loadImage(`${__dirname}/${this.sourceImagePath}`);
    const outputStreamFile = fs.createWriteStream(`${__dirname}/graphique.png`);

    const canvas = createCanvas(inputImage.width, inputImage.height);
    const ctx = canvas.getContext('2d');
    ctx.patternQuality = 'best';
    ctx.drawImage(inputImage, 0, 0);
    this.getAverageChunkColor(ctx, 290, 290, 350, 350);


    // const white = Color([255, 255, 255]);

    // ctx.fillStyle = white.hex();
    // ctx.rect(200, 200, 210, 210);

    // ctx.fill();
    const stream = canvas.createPNGStream();
    stream.pipe(outputStreamFile);
  }
}
