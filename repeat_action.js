'use strict';

const Action = require('./action');
const log = require('./log');

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

  isDone() {
    if (!super.isDone()) {
      return false;
    }

    this.remaining_count--;
    if (this.remaining_count === 0) {
      return true;
    }

    this.resetAllChildren();

    return false;
  }
}

module.exports = RepeatAction;
