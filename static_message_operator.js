'use strict';

const Layer = require('./layer');
const Operator = require('./operator');
const log = require('./log');

class StaticMessageOperator extends Operator {

  constructor(options = {
    message: '',
    run_ms: 1000,
  }) {
    super();

    this.message = options.message;
    this.setWidth(this.message.length);

    this.remaining_ms = options.run_ms;

    this.layer = new Layer(this.width);

    for (const [cell_index, cell] of this.layer.entries()) {
      cell.setCharacterColor(this.message[cell_index], [1, 1, 1]);
    }
  }

  runTime(ms) {
    super.runTime(ms);
    this.remaining_ms -= ms;
  }

  applyToLayer(layer) {
    this.layer.copyToLayer(layer);
  }

  isDone() {
    return this.remaining_ms <= 0;
  }
}

module.exports = StaticMessageOperator;
