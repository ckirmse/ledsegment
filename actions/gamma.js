'use strict';

const Action = require('../action');
const log = require('../log');

class GammaAction extends Action {

  constructor(options = {}) {
    const {
      gamma = 2.8,
    } = options;

    super(options);

    this.gamma = gamma;
  }

  applyToLayer(layer) {
    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      const corrected_color = [
        color[0] ** this.gamma,
        color[1] ** this.gamma,
        color[2] ** this.gamma,
      ];
      layer.getCell(cell_index).setSegmentColor(segment_index, corrected_color);
    }
  }

}

module.exports = GammaAction;
