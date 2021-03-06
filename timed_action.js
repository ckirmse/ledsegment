'use strict';

const Action = require('./action');
const EaseLib = require('./ease_lib');
const log = require('./log');

class TimedAction extends Action {

  constructor(options = {}) {
    const {
      ms = 1000,
      is_reversed = false,
      offset = 0,
      ease = 'linear',
    } = options;

    super(options);

    this.ms = ms;
    this.is_reversed = options.is_reversed;
    this.initial_offset = offset;
    if (!Object.prototype.hasOwnProperty.call(EaseLib, ease)) {
      log.error('unknown ease', ease);
      throw new Error('UnknownEase');
    }
    this.ease_func = EaseLib[ease];

    this.reset();
  }

  getTotalMs() {
    return this.ms;
  }

  reset() {
    this.remaining_ms = this.ms;
    this.offset = this.initial_offset;
    this.progress_frac = 0;
  }

  runTime(ms) {
    super.runTime(ms);
    this.remaining_ms = Math.max(0, this.remaining_ms - ms);

    this.progress_frac = 1 - (this.remaining_ms / this.ms);
  }

  applyToLayer(layer) {
    let progress_frac = this.progress_frac + this.offset;
    if (progress_frac > 1) {
      progress_frac -= Math.floor(progress_frac);
    }
    progress_frac = this.ease_func(this.progress_frac + this.offset);
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
