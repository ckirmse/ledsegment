'use strict';

const Operator = require('./operator');
const log = require('./log');

class SetOnOperator extends Operator {

  constructor(options = {
    run_ms: 1000,
  }) {
    super();

    this.remaining_ms = options.run_ms;
  }

  init(display) {
  }

  runTime(ms) {
    super.runTime(ms);
    this.remaining_ms -= ms;
  }

  applyToLayer(layer) {
    layer.callEachCell((cell_index, cell) => {
      cell.setAllSegmentsColor([1, 1, 1]);
    });
  }

  isDone() {
    return this.remaining_ms <= 0;
  }
}

module.exports = SetOnOperator;
