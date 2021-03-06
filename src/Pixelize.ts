import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import fs from 'fs';
import Color from 'color';
const execSync = require('child_process').execSync;

/**
 * Must be in the format #RRGGBB or #RRGGBBAA
 */
export type CSSHex = Array<string>;

type RGBA = Array<[number, number, number, number]>;

export interface PixelizeOptions {
  shape?: 'square' | 'dots';
  colorPallet?: CSSHex;
}

export class Pixelize {
  static defaultOptions: PixelizeOptions = {
    shape: 'square'
  };

  private static transformeCoulourPalette(colors: CSSHex): RGBA {
    return colors.map((color) => {
      const translatedColor = Color(color);
      return [translatedColor.red(), translatedColor.green(), translatedColor.blue(), translatedColor.alpha()];
    });
  }

  private static getAverageChunkColor(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string {
    const pixelData = ctx.getImageData(x1, y1, x2 - x1, y2 - y1);
    let averageColor = [pixelData.data[0], pixelData.data[1], pixelData.data[2], pixelData.data[3]];

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

    const color = Color(averageColor);
    return color.hex();
  }

  private static getClosestColor(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, colorPalette: RGBA): string {
    const aColor = Color(Pixelize.getAverageChunkColor(ctx, x1, y1, x2, y2));
    const averageColor = [aColor.red(), aColor.green(), aColor.blue(), aColor.alpha()];
    const test = colorPalette.map((colorTester) => {
      const R1 = averageColor[0];
      const G1 = averageColor[1];
      const B1 = averageColor[2];
      const A1 = averageColor[3];

      const R2 = colorTester[0];
      const G2 = colorTester[1];
      const B2 = colorTester[2];
      const A2 = colorTester[3];
      return Math.sqrt(Math.pow((R1 - R2),2) + Math.pow((G1 - G2),2) + Math.pow((B1 - B2),2) + Math.pow((A1 - A2),2));
    });
    const indexGoodColor = test.indexOf(Math.min(...test));
    return Color(colorPalette[indexGoodColor]).hex();
  }

  private static async drawRects(ctx: CanvasRenderingContext2D, ctxReference: CanvasRenderingContext2D, verticalDivision: number, pixelPerDivision: number, colorPalette: CSSHex | undefined) {
    let colors: RGBA = [];
    if (colorPalette !== undefined) {
      colors = Pixelize.transformeCoulourPalette(colorPalette);
    }
    for (let rowIndex = 0; rowIndex < verticalDivision; rowIndex++) {
      for (let columnIndex = 0; columnIndex < verticalDivision; columnIndex++) {
        const x1 = columnIndex * pixelPerDivision;
        const x2 = (columnIndex + 1) * pixelPerDivision;
        const y1 = rowIndex * pixelPerDivision;
        const y2 = (rowIndex + 1) * pixelPerDivision;
        if (colorPalette === undefined) {
          ctx.fillStyle = Pixelize.getAverageChunkColor(ctxReference, x1, y1, x2, y2);
        } else {
          ctx.fillStyle = Pixelize.getClosestColor(ctxReference, x1, y1, x2, y2, colors);
        }
        ctx.fillRect(x1, y1, pixelPerDivision + 1, pixelPerDivision + 1);
      }
    }
  }

  private static async drawDots(ctx: CanvasRenderingContext2D, ctxReference: CanvasRenderingContext2D, verticalDivision: number, pixelPerDivision: number, colorPalette: CSSHex | undefined) {
    let colors: RGBA = [];
    if (colorPalette !== undefined) {
      colors = Pixelize.transformeCoulourPalette(colorPalette);
    }
    const radius = pixelPerDivision / 2;
    const offset = pixelPerDivision / 2;
    for (let rowIndex = 0; rowIndex < verticalDivision; rowIndex++) {
      for (let columnIndex = 0; columnIndex < verticalDivision; columnIndex++) {
        const x1 = columnIndex * pixelPerDivision;
        const x2 = (columnIndex + 1) * pixelPerDivision;
        const y1 = rowIndex * pixelPerDivision;
        const y2 = (rowIndex + 1) * pixelPerDivision;
        if (colorPalette === undefined) {
          ctx.fillStyle = Pixelize.getAverageChunkColor(ctxReference, x1, y1, x2, y2);
        } else {
          ctx.fillStyle = Pixelize.getClosestColor(ctxReference, x1, y1, x2, y2, colors);
        }
        ctx.beginPath();
        ctx.arc(offset + x1, offset + y1, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  static async minimize(inputFilePath: string, outputFilePath: string, verticalDivision: number, options?: PixelizeOptions) {
    options = { ...Pixelize.defaultOptions, ...options }
    const inputImage = await loadImage(`${__dirname}/${inputFilePath}`);

    const inputCanvas = createCanvas(inputImage.width, inputImage.height);
    const ctxReference = inputCanvas.getContext('2d');
    ctxReference.drawImage(inputImage, 0, 0);

    const outputCanvas = createCanvas(inputImage.width, inputImage.height);
    const ctx = outputCanvas.getContext('2d');

    const pixelPerDivision = inputImage.width / verticalDivision;

    switch (options.shape) {
      case 'square': {
        Pixelize.drawRects(ctx, ctxReference, verticalDivision, pixelPerDivision, options.colorPallet);
        break;
      }
      case 'dots': {
        Pixelize.drawDots(ctx, ctxReference, verticalDivision, pixelPerDivision, options.colorPallet);
        break;
      }
      default:
        Pixelize.drawRects(ctx, ctxReference, verticalDivision, pixelPerDivision, options.colorPallet);
        break;
    }


    const outputStreamFile = fs.createWriteStream(`${__dirname}/${outputFilePath}`);
    const stream = outputCanvas.createPNGStream();
    stream.pipe(outputStreamFile);
  }

  static async renderVideo(inputFilePath: string, outputFiltPath: string, minDivision: number, maxDivision: number, frameRate: number, options?: PixelizeOptions) {
    options = { ...Pixelize.defaultOptions, ...options }
    const folderName = `${__dirname}/animation`;

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }
    const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
    const inputImage = await loadImage(`${__dirname}/${inputFilePath}`);
    const inputCanvas = createCanvas(inputImage.width, inputImage.height);
    const ctxReference = inputCanvas.getContext('2d');
    ctxReference.drawImage(inputImage, 0, 0);

    const framesWrote = [];
    for (let currentVerticalDivision = minDivision; currentVerticalDivision < maxDivision; currentVerticalDivision++) {
      const outputCanvas = createCanvas(inputImage.width, inputImage.height);
      const ctx = outputCanvas.getContext('2d');

      const pixelPerDivision = inputImage.width / currentVerticalDivision;

      switch (options.shape) {
        case 'square': {
          Pixelize.drawRects(ctx, ctxReference, currentVerticalDivision, pixelPerDivision, options.colorPallet);
          break;
        }
        case 'dots': {
          Pixelize.drawDots(ctx, ctxReference, currentVerticalDivision, pixelPerDivision, options.colorPallet);
          break;
        }
        default:
          Pixelize.drawRects(ctx, ctxReference, currentVerticalDivision, pixelPerDivision, options.colorPallet);
          break;
      }
      const outputStreamFile = fs.createWriteStream(`${__dirname}/animation/frame-${zeroPad(currentVerticalDivision, 4)}.png`);
      const stream = outputCanvas.createPNGStream();
      stream.pipe(outputStreamFile);

      outputStreamFile.once('close', () => {
        framesWrote.push(currentVerticalDivision);
        if (framesWrote.length === (maxDivision - minDivision)) {
          execSync(`ffmpeg -y -r ${frameRate} -start_number ${minDivision} -i ${__dirname}/animation/frame-%04d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p ${__dirname}/${outputFiltPath}`);
        }
      });

    }
  }
}
