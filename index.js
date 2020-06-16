'use strict';

const ConcatenateOperator = require('./concatenate_operator');
const FadeToColorOperator = require('./fade_to_color_operator');
const log = require('./log');
const Operator = require('./operator');
const ScrollOperator = require('./scroll_operator');
const SetColorOperator = require('./set_color_operator');
const SetOnOperator = require('./set_on_operator');
const SetToRainbowByCellOperator = require('./set_to_rainbow_by_cell_operator');
const SetToRainbowBySegmentOperator = require('./set_to_rainbow_by_segment_operator');
const StaticMessageOperator = require('./static_message_operator');
const OutputLed = require('./output_led');
const OutputTerminal = require('./output_terminal');

const sleep = function (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
}

const run = async function (output, operator) {
  let prev_ms = Date.now();

  while (true) {
    let now = Date.now();
    const elapsed_ms = now - prev_ms;

    operator.runTime(elapsed_ms);

    if (operator.isDone()) {
      break;
    }

    output.render(operator);

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
  //const output = createOutputLed();
  const output = createOutputTerminal();

  await run(output, new Operator([
    new SetOnOperator({run_ms: 2000}),
    new SetColorOperator({color: [0.001, 0.001, 0.001]}),
    new FadeToColorOperator({
      run_ms: 100,
      color: [1, 1, 1]
    }),
    new SetToRainbowByCellOperator(),
    new FadeToColorOperator({
      run_ms: 2000,
      color: [0, 0, 0]
    }),
  ]));

  /*
  await run(output, new ConcatenateOperator([
    new StaticMessageOperator({
      message: 'ABC',
      run_ms: 2000
    }),
    new StaticMessageOperator({
      message: ' DEF',
      run_ms: 2000
    }),
    new StaticMessageOperator({
      message: ' GHI',
      run_ms: 2000
    }),
  ]));
  */

  await run(output, new Operator([
    new StaticMessageOperator({
      message: '*\\/++\\/*',
      run_ms: 2000
    }),
    new SetColorOperator({color: [0.0001, 0.0001, 0.0001]}),
    new FadeToColorOperator({
      run_ms: 50,
      color: [0.1, 0.7, 0.7]
    }),
  ]));

  await run(output, new Operator([
    new ScrollOperator({
      scroll_ms: ScrollOperator.SCROLL_FAST,
    }, [
      new ConcatenateOperator([
        new Operator([
          new ConcatenateOperator([
            new StaticMessageOperator({
              message: 'This is a longer message',
            }),
          ]),
          new SetToRainbowByCellOperator(),
        ]),
        new StaticMessageOperator({
          message: ' and this is white text',
        }),
        new StaticMessageOperator({
          message: ' '.repeat(8),
        }),
      ]),
    ]),
  ]));

/*
  await runModes([
    new Mode([
      new SetOnOperator({run_ms: 2000}),
      new SetColorOperator({color: [0.001, 0.001, 0.001]}),
      new FadeToColorOperator({
        run_ms: 100,
        color: [1, 1, 1]
      }),
      new SetToRainbowByCellOperator(),
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
      new SetColorOperator({color: [0.1, 0.7, 0.7]}),
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
*/
  output.destroy();
};

main();
