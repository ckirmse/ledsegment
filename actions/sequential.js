'use strict';

const Action = require('../action');
const log = require('../log');

class SequentialAction extends Action {

  constructor(options = {}) {
    super(options);

    this.child_index = 0;
  }

  reset() {
    super.reset();
    this.child_index = 0;
    this.is_done = false;
  }

  runTime(ms) {
    let action = this.child_actions[this.child_index];
    action.runTime(ms);

    if (action.isDone()) {
      if (this.child_index < this.child_actions.length - 1) {
        this.child_index++;
      } else {
        this.is_done = true;
      }
    }
  }

  applyToLayer(layer) {
    let action = this.child_actions[this.child_index];
    action.applyToLayer(layer);
  }

  isDone() {
    return this.is_done;
  }

}

module.exports = SequentialAction;
