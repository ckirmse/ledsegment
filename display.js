'use strict';

const Layer = require('./layer');
const log = require('./log');

const NUM_CELLS = 8;

class Display {

  constructor() {
    this.layer = new Layer(NUM_CELLS);
  }

  static getNumCells() {
    return NUM_CELLS;
  }

  composeLayers(layers) {
    for (const layer of layers) {
      layer.compose(this.layer);
    }
  }

  getDisplayLayer() {
    return this.layer;
  }
}

module.exports = Display;
