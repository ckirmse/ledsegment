'use strict';

const Operator = require('./operator');
const log = require('./log');

class SetColorOperator extends Operator {

  constructor(options = {
    gamma: 2.8,
  }) {
    super();

    this.gamma = options.gamma;
  }

  applyToLayer(layer) {
    layer.callEachSegment((cell_index, segment_index, color) => {
      const corrected_color = [
        color[0] ** this.gamma,
        color[1] ** this.gamma,
        color[2] ** this.gamma,
      ];
      layer.getCell(cell_index).setSegmentColor(segment_index, corrected_color);
    });
  }

}

module.exports = SetColorOperator;
