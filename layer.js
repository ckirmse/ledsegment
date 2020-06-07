'use strict';

const Cell = require('./cell');
const log = require('./log');

class Layer {

  constructor(num_cells) {
    this.cells = [];
    for (let i = 0; i < num_cells; i++) {
      this.cells[i] = new Cell();
    }
  }

  getCell(cell_index) {
    return this.cells[cell_index];
  }

  compose(layer) {
    for (let i = 0; i < this.cells.length; i++) {
      layer.getCell(i).setState(this.getCell(i).getState());
    }
  }
}

module.exports = Layer;
