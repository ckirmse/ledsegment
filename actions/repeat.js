'use strict';

const Action = require('../action');
const log = require('../log');

class RepeatAction extends Action {

  constructor(options = {}) {
    const {
      count = 2,
    } = options;

    super(options);

    this.total_count = count;

    this.reset();
  }

  reset() {
    this.remaining_count = this.total_count;
  }

  runTime(ms) {
    super.runTime(ms);

    if (!super.isDone()) {
      return;
    }

    this.remaining_count = Math.max(0, this.remaining_count - 1);

    this.resetAllChildren();
  }

  isDone() {
    return this.remaining_count === 0;
  }
}

module.exports = RepeatAction;
