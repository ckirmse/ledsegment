'use strict';

const Display = require('./display');
const log = require('./log');
const ModeScrollMessage = require('./mode_scroll_message');
const OutputLed = require('./output_led');

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

const sleep = function (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
}

const main = async function () {

  const display = new Display();
  const output_led = new OutputLed();

  process.on('SIGINT', () => {
    console.log('terminating');
    output_led.destroy();
    process.exit(0);
  });

  output_led.setBrightness(100);

  let prev_ms = Date.now();

  display.getCell(0).setCharacterColor('A', colorwheel(50));
  display.getCell(1).setCharacterColor('b', colorwheel(150));
  display.getCell(2).setCharacterColor('c', colorwheel(60));
  display.getCell(3).setCharacterColor('2', colorwheel(70));
  display.getCell(4).setCharacterColor('7', colorwheel(70));
  display.getCell(5).setCharacterColor('%', colorwheel(70));

  const mode = new ModeScrollMessage('this is a long message');
  let i = 0;
  while (true) {
    let now = Date.now();
    const elapsed_ms = now - prev_ms;

    mode.runTime(elapsed_ms, display);

    //display.getCell(Math.floor(Math.random() * 8)).setSegmentColor(Math.floor(Math.random() * 15), colorwheel(i % 256));
    i++;

    output_led.render(display);

    prev_ms = now;
    await sleep(0);
  }


  setTimeout(() => {
    output_led.destroy();
  }, 5000);
};

main();
