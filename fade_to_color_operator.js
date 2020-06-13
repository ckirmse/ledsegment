'use strict';

const Operator = require('./operator');
const log = require('./log');

class FadeToColorOperator extends Operator {

  constructor(options = {
    run_ms: 1000,
    color: [0, 0, 0],
  }) {
    super();

    this.color = options.color;
    this.total_ms = options.run_ms;
    this.remaining_ms = options.run_ms;

    this.progress_frac = 0;
  }

  init(display) {
  }

  runTime(ms) {
    super.runTime(ms);
    this.remaining_ms = Math.max(0, this.remaining_ms - ms);

    this.progress_frac = 1 - (this.remaining_ms / this.total_ms);

  }

  applyToLayer(layer) {
    layer.callEachSegment((cell_index, segment_index, color) => {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        return;
      }

      const faded_color = [
        color[0] * (1 - this.progress_frac) + this.color[0] * this.progress_frac,
        color[1] * (1 - this.progress_frac) + this.color[1] * this.progress_frac,
        color[2] * (1 - this.progress_frac) + this.color[2] * this.progress_frac,
      ];

      layer.getCell(cell_index).setSegmentColor(segment_index, faded_color);
    });
  }

}

module.exports = FadeToColorOperator;
