'use strict';

const Action = require('../action');
const log = require('../log');

class MultiplyColorAction extends Action {

  constructor(options = {}) {
    const {
      color = [1, 1, 1],
    } = options;

    super(options);

    this.color = color;
  }

  applyToLayer(layer) {
    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        continue;
      }
      const cell = layer.getCell(cell_index);
      const input_color = cell.getSegmentColor(segment_index);
      const output_color = [
        input_color[0] * this.color[0],
        input_color[1] * this.color[1],
        input_color[2] * this.color[2],
      ];
      layer.getCell(cell_index).setSegmentColor(segment_index, output_color);
    }
  }

}

module.exports = MultiplyColorAction;
