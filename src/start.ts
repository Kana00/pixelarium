import { createCanvas } from 'canvas';
import fs from 'fs';
const WIDTH = 1000;
const HEIGHT = 800;
const out = fs.createWriteStream(__dirname + '/graphique.png');
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

ctx.rect(0, 0, 10, 10);

const stream = canvas.createPNGStream();
stream.pipe(out);
