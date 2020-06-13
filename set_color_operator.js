'use strict';

const Operator = require('./operator');
const log = require('./log');

class SetColorOperator extends Operator {

  constructor(options = {
    color: [1, 1, 1],
  }) {
    super();

    this.color = options.color;
  }

  applyToLayer(layer) {
    layer.callEachSegment((cell_index, segment_index, color) => {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        return;
      }
      layer.getCell(cell_index).setSegmentColor(segment_index, this.color);
    });
  }

}

module.exports = SetColorOperator;
