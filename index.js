'use strict';

const Display = require('./display');
const FadeToColorOperator = require('./fade_to_color_operator');
const GammaOperator = require('./gamma_operator');
const log = require('./log');
const Mode = require('./mode');
const ScrollMessageOperator = require('./scroll_message_operator');
const SetColorOperator = require('./set_color_operator');
const SetOnOperator = require('./set_on_operator');
const StaticMessageOperator = require('./static_message_operator');
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

  const gamma_operator = new GammaOperator();

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
    mode.runTime(elapsed_ms);

    if (mode.isDone()) {
      mode_index++;
      if (mode_index < modes.length) {
        modes[mode_index].init(display);
      }
    }

    mode.applyToLayer(display.getDisplayLayer());

    gamma_operator.applyToLayer(display.getDisplayLayer());

    output_led.render(display);

    prev_ms = now;
    await sleep(0);
  }
};

const main = async function () {

  await runModes([
    new Mode([
      new SetOnOperator({run_ms: 2000}),
      new SetColorOperator({color: [0.001, 0.001, 0.001]}),
      new FadeToColorOperator({
        run_ms: 100,
        color: [1, 1, 1]
      }),
      new FadeToColorOperator({
        run_ms: 2000,
        color: [0, 0, 0]
      }),
    ]),
    new Mode([
      new StaticMessageOperator({
        message: '*\\/++\\/*',
        run_ms: 2000
      }),
      new SetColorOperator({color: [0.001, 0.001, 0.001]}),
      new FadeToColorOperator({
        run_ms: 50,
        color: [1, 0, 0]
      }),
    ]),
    new Mode([
      new ScrollMessageOperator({
        message: ' this is a long message',
        end: ScrollMessageOperator.END_LAST_CHARACTER_VISIBLE,
        scroll_ms: ScrollMessageOperator.SCROLL_FAST,
      }),
    ]),
    new Mode([
      new ScrollMessageOperator({
        message: ' and this is shorter',
        end: ScrollMessageOperator.END_LAST_CHARACTER_OFF,
        scroll_ms: ScrollMessageOperator.SCROLL_FAST,
      }),
      new SetColorOperator({color: [0.3, 0.3, 0.7]}),
      new FadeToColorOperator({
        run_ms: 4000,
        color: [1.0, 0.0, 0.0]
      }),
    ]),
  ]);

};

main();
