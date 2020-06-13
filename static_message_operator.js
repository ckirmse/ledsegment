'use strict';

const Display = require('./display');
const Layer = require('./layer');
const Operator = require('./operator');
const log = require('./log');

class StaticMessageOperator extends Operator {

  constructor(message, options = {
    run_ms: 1000,
  }) {
    super();

    this.message = message;

    this.remaining_ms = options.run_ms;

    this.layer = new Layer(Display.getNumCells());
  }

  init(display) {
    const num_cells = Display.getNumCells();
    for (let i = 0; i < num_cells; i++) {
      this.layer.getCell(i).setCharacterColor(this.message[i], [1, 1, 1]);
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
