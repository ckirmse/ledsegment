'use strict';

const ws281x = require('rpi-ws281x-native');

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

const main = function () {
  const num_leds = 120;
  ws281x.init(num_leds, {
    gpioNum: 12,
  });

  ws281x.setBrightness(100);

  process.on('SIGINT', () => {
    console.log('terminating');
    ws281x.reset();
    process.exit(0);
  });

  const pixel_data = new Uint32Array(num_leds);
  const begin_ms = Date.now();
  let i = 0;
  while (i < 256 * 4) {
    pixel_data[i % 120] = colorwheel(i % 256);
    ws281x.render(pixel_data);
    i++;
  }
  const end_ms = Date.now();
  console.log(i, 'took', end_ms - begin_ms, (end_ms - begin_ms) / i);
  ws281x.reset();
};

main();
