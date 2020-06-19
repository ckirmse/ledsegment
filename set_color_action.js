'use strict';

const Action = require('./action');
const log = require('./log');

class SetColorAction extends Action {

  constructor(options = {
    color: [1, 1, 1],
  }) {
    super();

    this.color = options.color;
  }

  applyToLayer(layer) {
    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        continue;
      }
      layer.getCell(cell_index).setSegmentColor(segment_index, this.color);
    }
  }

}

module.exports = SetColorAction;
