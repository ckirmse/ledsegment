'use strict';

const Action = require('../action');
const EaseLib = require('../ease_lib');
const log = require('../log');

class ClockAction extends Action {

  constructor(options = {}) {
    const {
      fade_ms = 500,
      ease = 'linear',
    } = options;

    super(options);

    this.setWidth(8);

    this.fade_ms = fade_ms;
    if (!Object.prototype.hasOwnProperty.call(EaseLib, ease)) {
      log.error('unknown ease', ease);
      throw new Error('UnknownEase');
    }
    this.ease_func = EaseLib[ease];

    this.epoch_ms = Date.now();
  }

  runTime(ms) {
    this.epoch_ms = Date.now();
  }

  applyToLayer(layer) {
    const current_datetime = new Date(this.epoch_ms);

    const current_hours_str = current_datetime.getHours().toString().padStart(2, ' ');
    const current_minutes_str = current_datetime.getMinutes().toString().padStart(2, '0');
    const current_seconds_str = current_datetime.getSeconds().toString().padStart(2, '0');
    const current_str = `${current_hours_str} ${current_minutes_str} ${current_seconds_str}`;

    const next_datetime = new Date(this.epoch_ms + this.fade_ms);
    const next_hours_str = next_datetime.getHours().toString().padStart(2, ' ');
    const next_minutes_str = next_datetime.getMinutes().toString().padStart(2, '0');
    const next_seconds_str = next_datetime.getSeconds().toString().padStart(2, '0');
    const next_str = `${next_hours_str} ${next_minutes_str} ${next_seconds_str}`;

    let current_frac;
    if ((current_datetime % 1000) > (1000 - this.fade_ms)) {
      // start fading out current
      current_frac = (1000 - (current_datetime % 1000)) / this.fade_ms;
    } else {
      // all current
      current_frac = 1;
    }
    current_frac = this.ease_func(current_frac);

    const next_frac = 1 - current_frac;

    for (const [cell_index, cell] of layer.entries()) {
      cell.clear();
      if (cell_index < current_str.length) {
        cell.addCharacterColor(current_str[cell_index], [current_frac, current_frac, current_frac]);
      }
      if (cell_index < next_str.length) {
        cell.addCharacterColor(next_str[cell_index], [next_frac, next_frac, next_frac]);
      }
    }
    layer.getCell(2).setPeriodColor([1, 1, 1]);
    layer.getCell(4).setPeriodColor([1, 1, 1]);

  }
}

module.exports = ClockAction;
