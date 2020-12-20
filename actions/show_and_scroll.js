'use strict';

const Layer = require('../layer');
const log = require('../log');
const Action = require('../action');

const ScrollAction = require('./scroll');

class ShowAndScrollAction extends Action {

  constructor(options = {}) {
    const {
      show_ms = 1000,
      scroll_ms = ScrollAction.SCROLL_FAST,
    } = options;

    super(options);

    this.show_ms = show_ms;
    this.scroll_ms = scroll_ms;

    this.reset();

    //log.info(`constructor src ${this.src_index} max_child_width ${this.max_child_width} run_steps ${this.run_steps}`);
  }

  reset() {
    this.remaining_ms = this.show_ms;
    this.src_index = 0;
    this.run_steps = Math.max(1, this.getWidth() - 1);
    this.is_show = true;
    this.is_done = false;
  }

  runTime(ms) {
    super.runTime(ms);

    this.remaining_ms -= ms;
    if (this.remaining_ms > 0) {
      return;
    }

    if (this.is_show) {
      this.remaining_ms = this.scroll_ms;
      this.is_show = false;
      return;
    }

    this.remaining_ms -= ms;
    if (this.remaining_ms > 0) {
      return;
    }

    //log.info('src, dest, run_steps', this.src_index, this.run_steps);

    if (this.src_index >= this.run_steps) {
      this.is_done = true;
    }

    //log.info(`runTime src ${this.src_index} run_steps ${this.run_steps}`);

    this.remaining_ms += this.scroll_ms;

    this.src_index++;
  }

  applyToLayer(layer) {
    const temp_layer = new Layer(this.getWidth());
    for (const action of this.child_actions) {
      action.applyToLayer(temp_layer);
    }

    temp_layer.copyToLayer(layer, this.src_index, 0);
  }

  isDone() {
    return this.is_done;
  }
}

module.exports = ShowAndScrollAction;
