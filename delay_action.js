'use strict';

const Action = require('./action');

class DelayAction extends Action {

  constructor({
    ms = 1000,
  } = {}) {
    super();

    this.remaining_ms = ms;
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
