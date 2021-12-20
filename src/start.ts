//      _           __           _
//      ____  (_)  _____  / /___ ______(_)_  ______ ___
//     / __ \/ / |/_/ _ \/ / __ `/ ___/ / / / / __ `__ \
//    / /_/ / />  </  __/ / /_/ / /  / / /_/ / / / / / /
//   / .___/_/_/|_|\___/_/\__,_/_/  /_/\__,_/_/ /_/ /_/
//  /_/

import { Pixelize, CSSHex } from './Pixelize';

const palette: CSSHex = [
  '#FAFAFA', '#DADADA', '#B4B4B4', '#8E8E8E', '#666666', '#3D3D3D',
  '#212121', '#000000', '#F49AC1', '#F26D7D', '#A22226', '#651010',
  '#FDC689', '#E18121', '#895000', '#FFF799', '#FFF126', '#ABA000',
  '#827B00', '#C4DF9B', '#7CC576', '#197B30', '#005826', '#6DCFF6',
  '#00BFF3', '#004A80', '#002157', '#8781BD', '#8560A8', '#662D91',
  '#440E62'
];

Pixelize.minimize('./rose.jpg', './output.png', 70, { shape: 'square', colorPallet: palette });
// Pixelize.renderVideo('./rose.jpg', './output.mp4', 20, 100, 60, { shape: 'dots' });
