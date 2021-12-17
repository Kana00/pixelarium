//      _           __           _
//      ____  (_)  _____  / /___ ______(_)_  ______ ___
//     / __ \/ / |/_/ _ \/ / __ `/ ___/ / / / / __ `__ \
//    / /_/ / />  </  __/ / /_/ / /  / / /_/ / / / / / /
//   / .___/_/_/|_|\___/_/\__,_/_/  /_/\__,_/_/ /_/ /_/
//  /_/

import { Pixelization } from './Pixelization';


const reducer = new Pixelization({
  sourceImagePath: './rose.jpg',
  widthDivision: 60,
  showGrid: true
});

reducer.reduceImage();

// TODO
// - create some pixel form (circle, square)
// - create a color palette where the color must be approximation
// - create a vidéo frame per frame with different settings
// - create a console commande
