'use strict';

const ws281x = require('./binding/ws281x.node');

const main = function () {
  ws281x.init();

  const pixel_data = new Uint32Array(120);
  const begin_ms = Date.now();
  for (let i = 0; i < 120; i++) {
    pixel_data[i] = ((155 - i) << 16) | (128 << 8) | i;
    ws281x.render(pixel_data);
  }
  const end_ms = Date.now();
  console.log('120 took', end_ms - begin_ms);

  process.on('SIGINT', () => {
    console.log('terminating');
    ws281x.reset();
    process.exit(0);
  });

  setTimeout(() => {
    ws281x.reset();
  }, 10000);
};

main();
