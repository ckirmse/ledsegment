'use strict';

const ColorLib = require('../color_lib');
const log = require('../log');
const TimedAction = require('../timed_action');

class FadeToColorAction extends TimedAction {

  constructor(options = {}) {
    const {
      color = [0, 0, 0],
    } = options;

    super(options);

    this.color = color;
  }

  applyToLayerWithProgress(layer, progress_frac) {
    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        continue;
      }

      const output_color = [
        color[0] * (1 - progress_frac) + this.color[0] * progress_frac,
        color[1] * (1 - progress_frac) + this.color[1] * progress_frac,
        color[2] * (1 - progress_frac) + this.color[2] * progress_frac,
      ];

      layer.getCell(cell_index).setSegmentColor(segment_index, output_color);
    }
  }
}

module.exports = FadeToColorAction;
