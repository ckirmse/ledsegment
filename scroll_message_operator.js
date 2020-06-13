'use strict';

const Display = require('./display');
const Layer = require('./layer');
const Operator = require('./operator');
const log = require('./log');

class ScrollMessageOperator extends Operator {

  constructor(options = {
    message: '',
    end: ScrollMessageOperator.END_LAST_CHARACTER_OFF,
    scroll_ms: ScrollMessageOperator.SCROLL_FAST,
  }) {
    super();

    this.message = options.message;
    this.end = options.end;
    this.scroll_ms = options.scroll_ms;

    this.remaining_ms = 0;
    this.character_index = 0;
    this.is_done = false;

    this.layer = new Layer(Display.getNumCells());
  }

  init(display) {
    display.getDisplayLayer().copyToLayer(this.layer);
  }

  runTime(ms) {
    super.runTime(ms);

    if (this.is_done) {
      return;
    }

    this.remaining_ms -= ms;
    if (this.remaining_ms > 0) {
      return;
    }

    if (this.end === ScrollMessageOperator.END_LAST_CHARACTER_OFF) {
      if (this.character_index > this.message.length + Display.getNumCells()) {
        this.is_done = true;
        return;
      }
    } else {
      if (this.character_index >= this.message.length) {
        this.is_done = true;
        return;
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
    cell.setCharacterColor(ch, [1, 1, 1]);
    this.character_index++;
  }

  applyToLayer(layer) {
    this.layer.copyToLayer(layer);
  }

  isDone() {
    return this.is_done;
  }
}

ScrollMessageOperator.END_LAST_CHARACTER_VISIBLE = 1;
ScrollMessageOperator.END_LAST_CHARACTER_OFF = 2;

ScrollMessageOperator.SCROLL_FAST = 200;
ScrollMessageOperator.SCROLL_MEDIUM = 600;
ScrollMessageOperator.SCROLL_SLOW = 1000;

module.exports = ScrollMessageOperator;
