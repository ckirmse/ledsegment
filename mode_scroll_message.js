'use strict';

const Display = require('./display');
const Layer = require('./layer');
const log = require('./log');

class ModeScrollMessage {

  constructor(message) {
    this.message = message;
    this.color = [1.0, 0, 0];
    this.scroll_ms = 400;
    this.remaining_ms = 0;
    this.character_index = 0;

    this.layer = new Layer(Display.getNumCells());
  }

  runTime(ms, display) {
    this.remaining_ms -= ms;
    if (this.remaining_ms > 0) {
      return;
    }

    this.remaining_ms += this.scroll_ms;
    const num_cells = Display.getNumCells();
    for (let i = 0; i < num_cells - 1; i++) {
      const cell = this.layer.getCell(i);
      cell.setState(this.layer.getCell(i + 1).getState());
    }
    const cell = this.layer.getCell(num_cells - 1);
    let ch;
    if (this.character_index < this.message.length) {
      ch = this.message[this.character_index];
    } else {
      ch = ' ';
    }
    cell.setCharacterColor(ch, this.color);
    this.character_index++;

    display.composeLayers([this.layer]);
  }

}

module.exports = ModeScrollMessage;
