'use strict';

const log = require('./log');

class ModeScrollMessage {

  constructor(message) {
    this.message = message;
    this.color = 0x00ff2222;
    this.scroll_ms = 400;
    this.remaining_ms = 0;
    this.character_index = 0;
  }

  runTime(ms, display) {
    this.remaining_ms -= ms;
    if (this.remaining_ms > 0) {
      return;
    }

    this.remaining_ms += this.scroll_ms;
    const num_cells = display.getNumCells();
    for (let i = 0; i < num_cells - 1; i++) {
      const cell = display.getCell(i);
      cell.setState(display.getCell(i + 1).getState());
    }
    const cell = display.getCell(num_cells - 1);
    let ch;
    if (this.character_index < this.message.length) {
      ch = this.message[this.character_index];
    } else {
      ch = ' ';
    }
    cell.setCharacterColor(ch, this.color);
    this.character_index++;
  }

}

module.exports = ModeScrollMessage;
