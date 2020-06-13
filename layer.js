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

  getNumCells() {
    return this.cells.length;
  }

  getCell(cell_index) {
    return this.cells[cell_index];
  }

  copyToLayer(layer) {
    for (let i = 0; i < this.cells.length; i++) {
      layer.getCell(i).setState(this.getCell(i).getState());
    }
  }

  composeToLayer(layer) {
    for (let i = 0; i < this.cells.length; i++) {
      layer.getCell(i).setState(this.getCell(i).getState());
    }
  }

  callEachCell(func) {
    for (let i = 0; i < this.cells.length; i++) {
      func(i, this.cells[i]);
    }
  }

  callEachSegment(func) {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].callEachSegment((segment_index, color) => {
        func(i, segment_index, color);
      });
    }
  }

}

module.exports = Layer;
