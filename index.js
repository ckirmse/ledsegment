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

const runModes = async function (modes) {
  const display = new Display();
  const output_led = new OutputLed();

  process.on('SIGINT', () => {
    console.log('terminating');
    output_led.destroy();
    process.exit(0);
  });

  output_led.setBrightness(100);

  let prev_ms = Date.now();

  let mode_index = 0;
  modes[mode_index].init(display);

  while (mode_index < modes.length) {
    let now = Date.now();
    const elapsed_ms = now - prev_ms;

    const mode = modes[mode_index];
    if (mode.runTime(elapsed_ms, display) === true) {
      mode_index++;
      if (mode_index < modes.length) {
        modes[mode_index].init(display);
      }
    }

    output_led.render(display);

    prev_ms = now;
    await sleep(0);
  }
};

const main = async function () {

  await runModes([
    new ModeScrollMessage('this is a long message', {
      color: [0, 1, 0],
      end: ModeScrollMessage.END_LAST_CHARACTER_VISIBLE,
      scroll_ms: ModeScrollMessage.SCROLL_FAST,
    }),
    new ModeScrollMessage(' and this is shorter', {
      color: [0, 1, 1],
      end: ModeScrollMessage.END_LAST_CHARACTER_OFF,
      scroll_ms: ModeScrollMessage.SCROLL_FAST,
    })
  ]);

};

main();
