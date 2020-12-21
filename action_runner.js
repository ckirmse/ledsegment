'use strict';

const os = require('os');

const ActionTree = require('./action_tree');
const IpLib = require('./ip_lib');
const log = require('./log');
const OutputLed = require('./output_led');
const OutputTerminal = require('./output_terminal');
const ScrollAction = require('./actions/scroll');
const WebServer = require('./web_server');

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

const sleep = function (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
}

const getDefaultAction = async function () {
  const hostname = os.hostname();

  const ip_addresses = IpLib.getIpAddresses();

  return ActionTree.createActionFromData({
    type: 'default',
    child_actions: [{
      type: 'sequential',
      child_actions: [{
        type: 'default',
        child_actions: [{
          type: 'static_message',
          message: ' HELLO!',
        }, {
          type: 'set_color',
          color: [0, 1, 0],
        }, {
          type: 'fade_to_color',
          ms: 4000,
          color: [1, 1, 1],
        }, {
          type: 'sequential',
          child_actions: [{
            type: 'mask_middle_out',
            ms: 1000,
          }, {
            type: 'wait',
            ms: 4000,
          }, {
            type: 'mask_left_to_right',
            ms: 500,
            turn_on: true,
            is_reversed: true,
          }],
        }],
      }, {
        type: 'show_and_scroll',
        scroll_ms: ScrollAction.SCROLL_MEDIUM,
        child_actions: [{
          type: 'concatenate',
          child_actions: [{
            type: 'default',
            child_actions: [{
              type: 'static_message',
              message: 'HOSTNAME ',
            }, {
              type: 'set_color',
              color: [1, 0.5, 1],
            }, {
              type: 'rotate_hue_over_time',
              cycle_ms: 30000,
            }],
          }, {
            type: 'default',
            child_actions: [{
              type: 'static_message',
              message: hostname + ' '.repeat(8),
            }, {
              type: 'fade_to_color',
              ms: 5000,
              color: [0, 1, 1],
            }],
          }],
        }],
      }, {
        type: 'show_and_scroll',
        scroll_ms: ScrollAction.SCROLL_MEDIUM,
        child_actions: [{
          type: 'concatenate',
          child_actions: [{
            type: 'static_message',
            message: 'IP addresses ',
          }, {
            type: 'default',
            child_actions: [{
              type: 'static_message',
              message: ip_addresses.join(' '),
            }, {
              type: 'multiply_by_color_transition',
              top_left_color: [0, 0.5, 1],
              bottom_left_color: [0, 0.3, 0.6],
              top_right_color: [1, 1, 1],
              bottom_right_color: [0.6, 0.6, 0.6],
            }],
          }],
        }],
      }, {
        type: 'default',
        child_actions: [{
          type: 'clock',
          fade_ms: 1000,
          ease: 'easeInOut',
        }, {
          type: 'multiply_value_by_children',
          child_actions: [{
            type: 'set_on',
          }, {
            type: 'set_to_rainbow_by_cell',
          }, {
            type: 'rotate_hue_over_time',
          }],
        }, {
          type: 'sequential',
          child_actions: [{
            type: 'mask_top_to_bottom',
            ms: 500,
          }, {
            type: 'wait',
            ms: 29000,
          }, {
            type: 'mask_top_to_bottom',
            turn_on: false,
            ms: 500,
          }],
        }],
      }, {
        type: 'fade_to_children',
        ease: 'easeInOut',
        ms: 1000,
        child_actions: [{
          type: 'repeat',
          count: 1,
          child_actions: [{
            type: 'snake',
            ms: 12000,
          }, {
            type: 'snake',
            offset: 0.5,
            ms: 12000,
          }],
        }, {
          type: 'sequential',
          child_actions: [{
            type: 'default',
            child_actions: [{
              type: 'multiply_color',
              color: [0, 1, 0],
            }, {
              type: 'fade_to_color',
              ms: 3000,
              color: [1, 0, 1],
            }],
          }, {
            type: 'default',
            child_actions: [{
              type: 'multiply_color',
              color: [1, 0, 1],
            }, {
              type: 'fade_to_color',
              ms: 3000,
              color: [0, 1, 1],
            }],
          }, {
            type: 'default',
            child_actions: [{
              type: 'multiply_color',
              color: [0, 1, 1],
            }, {
              type: 'fade_to_color',
              ms: 3000,
              color: [1, 1, 0],
            }],
          }, {
            type: 'default',
            child_actions: [{
              type: 'multiply_color',
              color: [1, 1, 0],
            }, {
              type: 'fade_to_color',
              ms: 3000,
              color: [1, 1, 1],
            }],
          }],
        }, {
          type: 'sequential',
          child_actions: [{
            type: 'wait',
            ms: 10000,
          }, {
            type: 'fade_to_color',
            ms: 2000,
            ease: 'easeIn',
            color: [0, 0, 0],
          }],
        }],
      }],
    }],
  });
}

class ActionRunner {

  constructor(options) {
    if (!options) {
      throw new Error('MissingOptions');
    }
    if (options.output_terminal) {
      this.output = createOutputTerminal();
    } else {
      this.output = createOutputLed();
    }
    log.setOutput(this.output);

    this.http_port = options.http_port;

    this.is_done = false;
    this.action = null;
  }

  async init() {
    await ActionTree.init();

    this.action = await getDefaultAction();

    if (this.http_port) {
      WebServer.listen(this.http_port, this);
    }
  }

  destroy() {
    this.is_done = true;
  }

  setNextAction(action) {
    this.next_action = ActionTree.createActionFromData(action);
  }

  async run() {
    let prev_ms = Date.now();

    while (!this.is_done) {
      let now = Date.now();
      const elapsed_ms = now - prev_ms;

      this.action.runTime(elapsed_ms);

      this.output.render(this.action);

      prev_ms = now;

      await sleep(0);

      if (this.action.isDone()) {
        if (this.next_action) {
          this.action = this.next_action;
          this.next_action = null;
        } else {
          this.action.reset();
        }
      }
    }

    this.output.destroy();
  }

  getAction() {
    return this.action;
  }
}


module.exports = ActionRunner;
