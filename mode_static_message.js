'use strict';

const Display = require('./display');
const Layer = require('./layer');
const log = require('./log');

class ModeStaticMessage {

  constructor(message, options = {
    color: [1, 1, 1],
    run_ms: 1000,
  }) {
    this.message = message;
    this.color = options.color;

    this.remaining_ms = options.run_ms;

    this.layer = new Layer(Display.getNumCells());
  }

  init(display) {
    const num_cells = Display.getNumCells();
    for (let i = 0; i < num_cells; i++) {
      this.layer.getCell(i).setCharacterColor(this.message[i], this.color);
    }
  }

  // returns true when mode is over
  runTime(ms, display) {
    this.remaining_ms -= ms;
    if (this.remaining_ms <= 0) {
      return true;
    }

    display.composeLayers([this.layer]);
    return false;
  }

}

module.exports = ModeStaticMessage;
