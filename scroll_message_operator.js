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

    if (this.end === ScrollMessageOperator.END_LAST_CHARACTER_OFF) {
      this.message += ' '.repeat(Display.getNumCells());
    }
    this.layer = new Layer(this.message.length);
    for (let i = 0; i < this.message.length; i++) {
      this.layer.getCell(i).setCharacterColor(this.message[i], [1, 1, 1]);
    }
  }

  init(display) {
    this.dest_index = display.getDisplayLayer().getNumCells();
    this.run_steps = Math.max(1, this.message.length - (this.dest_index - 1));
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

    if (this.character_index >= this.run_steps) {
      this.is_done = true;
      return;
    }

    this.remaining_ms += this.scroll_ms;

    if (this.dest_index === 0) {
      this.character_index++;
    }
    this.dest_index = Math.max(0, this.dest_index - 1);
  }

  applyToLayer(layer) {
    this.layer.copyToLayer(layer, this.character_index, this.dest_index);
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
