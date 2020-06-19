'use strict';

const Action = require('./action');
const log = require('./log');

class SequentialAction extends Action {

  constructor(child_actions = []) {
    super(child_actions);

    this.child_index = 0;
  }

  runTime(ms) {
    if (this.isDone()) {
      return;
    }

    let action = this.child_actions[this.child_index];
    action.runTime(ms);

    if (action.isDone()) {
      this.child_index++;
    }
  }

  applyToLayer(layer) {
    if (this.isDone()) {
      return;
    }

    let action = this.child_actions[this.child_index];
    action.applyToLayer(layer);
  }

  isDone() {
    return this.child_index >= this.child_actions.length;
  }

}

module.exports = SequentialAction;
