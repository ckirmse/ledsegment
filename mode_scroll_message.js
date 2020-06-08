'use strict';

const Display = require('./display');
const Layer = require('./layer');
const log = require('./log');

class ModeScrollMessage {

  constructor(message, options = {
    color: [1, 1, 1],
    end: ModeScrollMessage.END_LAST_CHARACTER_OFF,
    scroll_ms: ModeScrollMessage.SCROLL_FAST,
  }) {
    this.message = message;
    this.color = options.color;
    this.end = options.end;
    this.scroll_ms = options.scroll_ms;

    this.remaining_ms = 0;
    this.character_index = 0;

    this.layer = new Layer(Display.getNumCells());
  }

  init(display) {
    display.getDisplayLayer().copyToLayer(this.layer);
  }

  // returns true when mode is over
  runTime(ms, display) {
    this.remaining_ms -= ms;
    if (this.remaining_ms > 0) {
      return false;
    }

    if (this.end === ModeScrollMessage.END_LAST_CHARACTER_OFF) {
      if (this.character_index > this.message.length + Display.getNumCells()) {
        return true;
      }
    } else {
      if (this.character_index >= this.message.length) {
        return true;
      }
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

    return false;
  }

}

ModeScrollMessage.END_LAST_CHARACTER_VISIBLE = 1;
ModeScrollMessage.END_LAST_CHARACTER_OFF = 2;

ModeScrollMessage.SCROLL_FAST = 200;
ModeScrollMessage.SCROLL_MEDIUM = 600;
ModeScrollMessage.SCROLL_SLOW = 1000;

module.exports = ModeScrollMessage;
