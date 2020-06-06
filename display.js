'use strict';

const Cell = require('./cell');
const log = require('./log');

const COUNT_CELLS = 8;

class Display {

  constructor() {
    this.cells = [];
    for (let i = 0; i < COUNT_CELLS; i++) {
      this.cells[i] = new Cell();
    }
  }

  getCountCells() {
    return COUNT_CELLS;
  }

  getCell(cell_index) {
    return this.cells[cell_index];
  }

}

module.exports = Display;
