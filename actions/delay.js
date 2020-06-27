'use strict';

const Action = require('../action');

class DelayAction extends Action {

  constructor(options = {}) {
    const {
      ms = 1000,
    } = options;

    super(options);

    this.total_ms = ms;

    this.reset();
  }

  reset() {
    this.remaining_ms = this.total_ms;
  }

  runTime(ms) {
    super.runTime(ms);

    this.remaining_ms = Math.max(0, this.remaining_ms - ms);
  }

  isDone() {
    return this.remaining_ms <= 0;
  }
}

module.exports = DelayAction;
