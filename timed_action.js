'use strict';

const Action = require('./action');
const log = require('./log');

class TimedAction extends Action {

  constructor(options = {}) {
    const {
      ms = 1000,
      is_reversed = false,
    } = options;

    super(options);

    this.total_ms = ms;
    this.is_reversed = options.is_reversed;

    this.reset();
  }

  reset() {
    this.remaining_ms = this.total_ms;
    this.progress_frac = 0;
  }

  runTime(ms) {
    super.runTime(ms);
    this.remaining_ms = Math.max(0, this.remaining_ms - ms);

    this.progress_frac = 1 - (this.remaining_ms / this.total_ms);
  }

  applyToLayer(layer) {
    let progress_frac = this.progress_frac;
    if (this.is_reversed) {
      progress_frac = 1 - progress_frac;
    }
    this.applyToLayerWithProgress(layer, progress_frac);
  }

  isDone() {
    if (this.remaining_ms > 0) {
      return false;
    }
    return super.isDone();
  }
}

module.exports = TimedAction;
