'use strict';

const Display = require('./display');
const log = require('./log');
const ModeScrollMessage = require('./mode_scroll_message');
const OutputLed = require('./output_led');

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

  const mode = new ModeScrollMessage('this is a long message');

  while (true) {
    let now = Date.now();
    const elapsed_ms = now - prev_ms;

    mode.runTime(elapsed_ms, display);

    output_led.render(display);

    prev_ms = now;
    await sleep(0);
  }
};

main();
