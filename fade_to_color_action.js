'use strict';

const Action = require('./action');
const log = require('./log');

class FadeToColorAction extends Action {

  constructor({
    child_actions = [],
    ms = 1000,
    color = [0, 0, 0]
  } = {}) {
    super(child_actions);

    this.color = color;
    this.total_ms = ms;
    this.remaining_ms = ms;

    this.progress_frac = 0;
  }

  runTime(ms) {
    super.runTime(ms);
    this.remaining_ms = Math.max(0, this.remaining_ms - ms);

    this.progress_frac = 1 - (this.remaining_ms / this.total_ms);

  }

  applyToLayer(layer) {
    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        continue;
      }

      const faded_color = [
        color[0] * (1 - this.progress_frac) + this.color[0] * this.progress_frac,
        color[1] * (1 - this.progress_frac) + this.color[1] * this.progress_frac,
        color[2] * (1 - this.progress_frac) + this.color[2] * this.progress_frac,
      ];

      layer.getCell(cell_index).setSegmentColor(segment_index, faded_color);
    }
  }

  isDone() {
    if (this.remaining_ms > 0) {
      return false;
    }
    return super.isDone();
  }
}

module.exports = FadeToColorAction;
