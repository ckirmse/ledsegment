'use strict';

const ArgumentParser = require('argparse').ArgumentParser;

const ActionTree = require('./action_tree');
const log = require('./log');
const ScrollAction = require('./actions/scroll');
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

  const parser = new ArgumentParser({
    description: 'Controller program for 8-character, 15-segment RGB LED device, or simulation',
  });
  parser.addArgument(['-t', '--terminal'], {
    defaultValue: false,
    action: 'storeTrue',
    dest: 'terminal',
    help: 'Output to terminal instead of hardware'
  });

  const args = parser.parseArgs();

  let output;
  if (args.terminal) {
    output = createOutputTerminal();
  } else {
    output = createOutputLed();
  }
  log.setOutput(output);

  await ActionTree.init();

  await run(output, ActionTree.createActionFromData({
    type: 'default',
    child_actions: [{
      type: 'static_message',
      message: 'ABC%-123',
    }, {
      type: 'set_color',
      color: [1, 0, 1],
    }, {
      type: 'sequential',
      child_actions: [{
        type: 'wait',
        ms: 1000,
      }, {
        type: 'fade_to_children',
        ms: 2000,
        child_actions: [{
          type: 'scroll',
          scroll_ms: ScrollAction.SCROLL_FAST,
          child_actions: [{
            type: 'static_message',
            message: 'MESSAGE COMING THROUGH!        ',
          }, {
            type: 'set_to_rainbow_by_cell',
          }, {
            type: 'fade_to_color',
            is_reversed: true,
            ms: 4000,
            color: [0, 0, 1],
          }],
        }],
      }],
    }],
  }));

  await run(output, ActionTree.createActionFromData({
    type: 'default',
    child_actions: [{
      type: 'static_message',
      message: ' HELLO!',
    }, {
      type: 'set_color',
      color: [0, 0, 1],
    }, {
      type: 'fade_to_color',
      ms: 2000,
      color: [1, 1, 1],
    }, {
      type: 'sequential',
      child_actions: [{
        type: 'mask_left_to_right',
        ms: 1000,
        turn_on: true,
      }, {
        type: 'wait',
        ms: 2000,
      }, {
        type: 'mask_left_to_right',
        ms: 500,
        reverse_direction: true,
        turn_on: true,
        is_reversed: true,
      }],
    }],
  }));

  await run(output, ActionTree.createActionFromData({
    type: 'default',
    child_actions: [{
      type: 'set_on',
    }, {
      type: 'set_color',
      color: [0.001, 0.001, 0.001],
    }, {
      type: 'fade_to_color',
        ms: 100,
      color: [1, 1, 1],
    }, {
      type: 'set_to_rainbow_by_cell',
    }, {
      type: 'sequential',
      child_actions: [{
        type: 'wait',
        ms: 3000,
      }, {
        type: 'repeat',
        count: 5,
        child_actions: [{
          type: 'sequential',
          child_actions: [{
            type: 'fade_to_color',
            ms: 200,
            color: [1, 1, 1],
          }, {
            type: 'fade_to_color',
            ms: 200,
            color: [1, 1, 1],
            is_reversed: true,
          }, {
            type: 'wait',
            ms: 300,
          }],
        }],
      }, {
        type: 'wait',
        ms: 1000,
      }, {
        type: 'fade_to_color',
        ms: 2000,
        color: [0.3, 1, 0],
        child_actions: [{
          type: 'wait',
          ms: 3000,
        }]
      }, {
        type: 'fade_to_color',
        is_reversed: true,
        ms: 2000,
        color: [0.3, 1, 0],
      }, {
        type: 'wait',
        ms: 1000,
      }, {
        type: 'fade_to_color',
        ms: 2000,
        color: [0, 0, 0],
      }],
    }, {
      type: 'sequential',
      child_actions: [{
        type: 'default',
        child_actions: [{
          type: 'mask_top_to_bottom',
          ms: 2000,
          reverse_direction: true,
          turn_on: true,
        }, {
          type: 'mask_left_to_right',
          ms: 2000,
          reverse_direction: true,
          turn_on: true,
        }],
      }, {
        type: 'wait',
        ms: 4000,
      }, {
        type: 'mask_top_to_bottom',
        ms: 2000,
        turn_on: false,
      }, {
        type: 'mask_left_to_right',
        ms: 2000,
        turn_on: true,
        ease: 'easeOut',
      }],
    }],
  }));

  await run(output, ActionTree.createActionFromData({
    type: 'default',
    child_actions: [{
      type: 'static_message',
      message: '*\\/++\\/*',
    }, {
      type: 'set_color',
      color: [0.0001, 0.0001, 0.0001],
    }, {
      type: 'fade_to_color',
      ms: 50,
      color: [0.1, 0.7, 0.7],
    }, {
      type: 'wait',
      ms: 2000,
    }],
  }));

  await run(output, ActionTree.createActionFromData({
    type: 'default',
    child_actions: [{
      type: 'scroll',
      scroll_ms: ScrollAction.SCROLL_FAST,
      child_actions: [{
        type: 'concatenate',
        child_actions: [{
          type: 'default',
          child_actions: [{
            type: 'static_message',
            message: 'This is a longer message.',
          }, {
            type: 'set_to_rainbow_by_cell',
          }],
        }, {
          type: 'static_message',
          message: ' This is white text.',
        }, {
          type: 'default',
          child_actions: [{
            type: 'static_message',
            message: ' Don\'t forget some rainbow text!',
          }, {
            type: 'set_to_rainbow_by_segment',
          }],
        }, {
          type: 'static_message',
          message: ' '.repeat(8),
        }],
      }],
    }],
  }));

  output.destroy();
};

main();
