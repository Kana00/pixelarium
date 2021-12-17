//      _           __           _
//      ____  (_)  _____  / /___ ______(_)_  ______ ___
//     / __ \/ / |/_/ _ \/ / __ `/ ___/ / / / / __ `__ \
//    / /_/ / />  </  __/ / /_/ / /  / / /_/ / / / / / /
//   / .___/_/_/|_|\___/_/\__,_/_/  /_/\__,_/_/ /_/ /_/
//  /_/

import { Pixelize } from './Pixelize';

// Pixelize.minimize('./rose.jpg', './output.png', 100, { shape: 'dots' });
Pixelize.renderVideo('./rose.jpg', './output.mp4', 20, 100, 60, { shape: 'dots' });
