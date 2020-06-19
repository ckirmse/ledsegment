'use strict';

const Action = require('./action');
const log = require('./log');

class SetOnAction extends Action {

  constructor(options = {
    run_ms: 1000,
  }) {
    super();

    this.remaining_ms = options.run_ms;
  }

  runTime(ms) {
    super.runTime(ms);
    this.remaining_ms -= ms;
  }

  applyToLayer(layer) {
    for (const cell of layer) {
      cell.setAllSegmentsColor([1, 1, 1]);
    }
  }

  isDone() {
    return this.remaining_ms <= 0;
  }
}

module.exports = SetOnAction;
