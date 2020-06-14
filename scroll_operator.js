'use strict';

const Display = require('./display');
const Layer = require('./layer');
const log = require('./log');
const Operator = require('./operator');

class ScrollOperator extends Operator {

  constructor(options = {
    scroll_ms: ScrollOperator.SCROLL_FAST,
  }, child_operators = []) {
    super(child_operators);

    this.pad = options.pad;
    this.scroll_ms = options.scroll_ms;

    this.remaining_ms = 0;
    this.src_index = 0;
    this.dest_index = Display.getNumCells() - 1;
    this.is_done = false;

    this.run_steps = Math.max(1, this.getWidth() - this.dest_index - 1);

    //log.info(`constructor src ${this.src_index} dest ${this.dest_index} max_child_width ${this.max_child_width} run_steps ${this.run_steps}`);
  }

  runTime(ms) {
    super.runTime(ms);

    this.remaining_ms -= ms;
    if (this.remaining_ms > 0) {
      return;
    }

    if (this.src_index >= this.run_steps) {
      this.is_done = true;
    }

    //log.info(`runTime src ${this.src_index} dest ${this.dest_index} run_steps ${this.run_steps}`);

    this.remaining_ms += this.scroll_ms;

    if (this.dest_index === 0) {
      this.src_index++;
    }
    this.dest_index = Math.max(0, this.dest_index - 1);
  }

  applyToLayer(layer) {
    const temp_layer = new Layer(this.getWidth());
    for (const operator of this.child_operators) {
      operator.applyToLayer(temp_layer);
    }

    temp_layer.copyToLayer(layer, this.src_index, this.dest_index);
  }

  isDone() {
    return this.is_done;
  }
}

ScrollOperator.SCROLL_FAST = 200;
ScrollOperator.SCROLL_MEDIUM = 600;
ScrollOperator.SCROLL_SLOW = 1000;

module.exports = ScrollOperator;
