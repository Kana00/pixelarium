import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import fs from 'fs';
import Color from 'color';

interface Options {
  sourceImagePath: string | null;
  widthDivision: number;
  showGrid?: boolean;
}

export class Pixelization {
  // default options
  options: Options = {
    sourceImagePath: null,
    widthDivision: 20,
    showGrid: false
  };

  constructor(options: Options) {
    this.options = options;
    if (this.options.sourceImagePath === null) throw new Error('You must add a correct file URL');
  }

  showGrid(ctx: CanvasRenderingContext2D, width: number, height: number, color?: string) {
    const pixelPerDivision = width / this.options.widthDivision;
    ctx.strokeStyle = color ? color : "#00000022";

    for (let rowIndex = 0; rowIndex < this.options.widthDivision; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.options.widthDivision; columnIndex++) {
        const x1 = columnIndex * pixelPerDivision;
        const x2 = (columnIndex + 1) * pixelPerDivision;
        const y1 = rowIndex * pixelPerDivision;
        const y2 = (rowIndex + 1) * pixelPerDivision;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      }
    }
  }

  getAverageChunkColor(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string {
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

  drawRect(ctx: CanvasRenderingContext2D, ctxReference: CanvasRenderingContext2D, pixelPerDivision: number) {
    for (let rowIndex = 0; rowIndex < this.options.widthDivision; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.options.widthDivision; columnIndex++) {
        const x1 = columnIndex * pixelPerDivision;
        const x2 = (columnIndex + 1) * pixelPerDivision;
        const y1 = rowIndex * pixelPerDivision;
        const y2 = (rowIndex + 1) * pixelPerDivision;
        ctx.fillStyle = this.getAverageChunkColor(ctxReference, x1, y1, x2, y2);
        ctx.fillRect(x1, y1, pixelPerDivision + 1, pixelPerDivision + 1);
      }
    }
  }

  drawDots(ctx: CanvasRenderingContext2D, ctxReference: CanvasRenderingContext2D, pixelPerDivision: number) {
    const radius = pixelPerDivision / 2;
    const offset = pixelPerDivision / 2;
    for (let rowIndex = 0; rowIndex < this.options.widthDivision; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.options.widthDivision; columnIndex++) {
        const x1 = columnIndex * pixelPerDivision;
        const x2 = (columnIndex + 1) * pixelPerDivision;
        const y1 = rowIndex * pixelPerDivision;
        const y2 = (rowIndex + 1) * pixelPerDivision;
        ctx.fillStyle = this.getAverageChunkColor(ctxReference, x1, y1, x2, y2);
        ctx.beginPath();
        ctx.arc(offset + x1, offset + y1, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  drawCircles(ctx: CanvasRenderingContext2D, ctxReference: CanvasRenderingContext2D, pixelPerDivision: number) {
    const radius = pixelPerDivision / 2;
    const offset = pixelPerDivision / 2;
    for (let rowIndex = 0; rowIndex < this.options.widthDivision; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.options.widthDivision; columnIndex++) {
        const x1 = columnIndex * pixelPerDivision;
        const x2 = (columnIndex + 1) * pixelPerDivision;
        const y1 = rowIndex * pixelPerDivision;
        const y2 = (rowIndex + 1) * pixelPerDivision;
        ctx.strokeStyle = this.getAverageChunkColor(ctxReference, x1, y1, x2, y2);
        ctx.beginPath();
        ctx.arc(offset + x1, offset + y1, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  async reduceImage() {
    const inputImage = await loadImage(`${__dirname}/${this.options.sourceImagePath}`);
    const outputStreamFile = fs.createWriteStream(`${__dirname}/graphique.png`);

    const canvas = createCanvas(inputImage.width, inputImage.height);
    const ctxReference = canvas.getContext('2d');
    ctxReference.drawImage(inputImage, 0, 0);


    const canvasOutput = createCanvas(inputImage.width, inputImage.height);
    const ctx = canvasOutput.getContext('2d');


    const pixelPerDivision = inputImage.width / this.options.widthDivision;

    // this.drawDots(ctx, ctxReference, pixelPerDivision);
    // this.drawRect(ctx, ctxReference, pixelPerDivision);
    this.drawCircles(ctx, ctxReference, pixelPerDivision);

    if (this.options.showGrid) {
      this.showGrid(ctx, inputImage.width, inputImage.height);
    }

    // write image
    const stream = canvasOutput.createPNGStream();
    stream.pipe(outputStreamFile);
  }
}
