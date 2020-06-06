'use strict';

const Cell = require('./cell');
const log = require('./log');

class OutputLed {

  constructor() {
    this.ws281x = require('./binding/ws281x.node');

    this.ws281x.init(120);
    this.pixel_data = new Uint32Array(120);
  }

  destroy() {
    this.ws281x.reset();
    this.ws281x = null;
  }

  setBrightness(brightness) {
    this.ws281x.setBrightness(brightness);
  }

  render(display) {
    let i = 0;
    for (let cell_index = 0; cell_index < display.getNumCells(); cell_index++) {
      const cell = display.getCell(cell_index);
      for (let segment_index = 0; segment_index < Cell.getNumSegments(); segment_index++) {
        this.pixel_data[i] = cell.getSegmentColor(segment_index);
        i++;
      }
    }

    this.ws281x.render(this.pixel_data);
  }

}

module.exports = OutputLed;
