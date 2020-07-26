'use strict';

const Action = require('../action');
const log = require('../log');

class ClockAction extends Action {

  constructor(options = {}) {
    super(options);

    this.setWidth(8);

    this.datetime = new Date();
  }

  runTime(ms) {
    const epoch_ms = Date.now();
    if ((epoch_ms - this.datetime.getTime()) < 100) {
      return;
    }

    this.datetime = new Date(epoch_ms);
  }

  applyToLayer(layer) {
    const hours_str = this.datetime.getHours().toString().padStart(2, ' ');
    const minutes_str = this.datetime.getMinutes().toString().padStart(2, '0');
    const seconds_str = this.datetime.getSeconds().toString().padStart(2, '0');
    const str = `${hours_str} ${minutes_str} ${seconds_str}`;

    for (const [cell_index, cell] of layer.entries()) {
      if (cell_index >= str.length) {
        continue;
      }
      cell.setCharacterColor(str[cell_index], [1, 1, 1]);
    }

  }
}

module.exports = ClockAction;
