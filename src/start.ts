//      _           __           _
//      ____  (_)  _____  / /___ ______(_)_  ______ ___
//     / __ \/ / |/_/ _ \/ / __ `/ ___/ / / / / __ `__ \
//    / /_/ / />  </  __/ / /_/ / /  / / /_/ / / / / / /
//   / .___/_/_/|_|\___/_/\__,_/_/  /_/\__,_/_/ /_/ /_/
//  /_/

import { Pixelization } from './Pixelization';


const reducer = new Pixelization({
  sourceImagePath: './rose.jpg',
  maxWidth: 1000
});

reducer.reduceImage();
