'use strict';

const Cell = require('./cell');
const log = require('./log');

class Layer {

  constructor(num_cells) {
    if (!num_cells) {
      log.error('Layer must have some cells');
      throw new Error('InvalidNumCells');
    }
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

  copyToLayer(layer, start_index = 0, dest_index = 0) {
    for (let i = 0; i < Math.min(layer.getNumCells() - dest_index, this.cells.length - start_index); i++) {
      layer.getCell(dest_index + i).setState(this.getCell(start_index + i).getState());
    }
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.cells.length; i++) {
      yield this.cells[i];
    }
  }

  *entries() {
    for (let i = 0; i < this.cells.length; i++) {
      yield [i, this.cells[i]];
    }
  }

  *segmentEntries() {
    for (let i = 0; i < this.cells.length; i++) {
      for (const [segment_index, color] of this.cells[i].entries()) {
        yield [i, segment_index, color];
      }
    }
  }
}

module.exports = Layer;
