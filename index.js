'use strict';

const ConcatenateAction = require('./concatenate_action');
const DelayAction = require('./delay_action');
const FadeToColorAction = require('./fade_to_color_action');
const log = require('./log');
const Action = require('./action');
const ScrollAction = require('./scroll_action');
const SequentialAction = require('./sequential_action');
const SetColorAction = require('./set_color_action');
const SetOnAction = require('./set_on_action');
const SetToRainbowByCellAction = require('./set_to_rainbow_by_cell_action');
const SetToRainbowBySegmentAction = require('./set_to_rainbow_by_segment_action');
const StaticMessageAction = require('./static_message_action');
const OutputLed = require('./output_led');
const OutputTerminal = require('./output_terminal');

const sleep = function (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
}

const run = async function (output, action) {
  let prev_ms = Date.now();

  while (true) {
    let now = Date.now();
    const elapsed_ms = now - prev_ms;

    action.runTime(elapsed_ms);

    if (action.isDone()) {
      break;
    }

    output.render(action);

    prev_ms = now;
    await sleep(0);
  }
};

const createOutputLed = function () {
  const output_led = new OutputLed();
  output_led.setBrightness(90);

  process.on('SIGINT', () => {
    console.log('terminating');
    output_led.destroy();
    process.exit(0);
  });

  return output_led;
}

const createOutputTerminal = function () {
  return new OutputTerminal();
};

const main = async function () {
  const output = createOutputLed();
  //const output = createOutputTerminal();
  log.setOutput(output);

  await run(output, new Action([
    new SetOnAction(),
    new SetColorAction({color: [0.001, 0.001, 0.001]}),
    new FadeToColorAction({
      run_ms: 100,
      color: [1, 1, 1]
    }),
    new SetToRainbowByCellAction(),
    new SequentialAction([
      new DelayAction({ms: 1000}),
      new FadeToColorAction({
        run_ms: 2000,
        color: [1, 1, 1]
      }),
      new DelayAction({ms: 1000}),
      new FadeToColorAction({
        run_ms: 2000,
        color: [0.3, 1, 0]
      }),
      new DelayAction({ms: 1000}),
      new FadeToColorAction({
        run_ms: 2000,
        color: [0, 0, 0]
      }),
    ]),
  ]));

  await run(output, new Action([
    new StaticMessageAction({
      message: '*\\/++\\/*',
    }),
    new SetColorAction({color: [0.0001, 0.0001, 0.0001]}),
    new FadeToColorAction({
      run_ms: 50,
      color: [0.1, 0.7, 0.7]
    }),
    new DelayAction({ms: 2000}),
  ]));

  await run(output, new Action([
    new ScrollAction({
      scroll_ms: ScrollAction.SCROLL_FAST,
    }, [
      new ConcatenateAction([
        new Action([
          new StaticMessageAction({
            message: 'This is a longer message',
          }),
          new SetToRainbowByCellAction(),
        ]),
        new StaticMessageAction({
          message: ' and this is white text.',
        }),
        new Action([
          new StaticMessageAction({
            message: ' Don\'t forget some rainbow text!',
          }),
          new SetToRainbowBySegmentAction(),
        ]),
        new StaticMessageAction({
          message: ' '.repeat(8),
        }),
      ]),
    ]),
  ]));

  output.destroy();
};

main();
