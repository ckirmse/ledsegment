'use strict';

const log = require('./log');
const Operator = require('./operator');
const RainbowLib = require('./rainbow_lib');

class SetToRainbowBySegmentOperator extends Operator {

  constructor() {
    super();

    this.color_wheel_position = RainbowLib.getRandomInitialValue();
  }

  applyToLayer(layer) {
    let color_wheel_position = this.color_wheel_position;
    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        continue;
      }

      layer.getCell(cell_index).setSegmentColor(segment_index, RainbowLib.colorWheel(color_wheel_position));
      color_wheel_position = RainbowLib.updateValue(color_wheel_position);
    }
  }

}

module.exports = SetToRainbowBySegmentOperator;
