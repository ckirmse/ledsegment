'use strict';

const log = require('./log');
const Operator = require('./operator');
const RainbowLib = require('./rainbow_lib');

class SetToRainbowByCellOperator extends Operator {

  constructor() {
    super();

    this.color_wheel_position = RainbowLib.getRandomInitialValue();
  }

  applyToLayer(layer) {
    let color_wheel_position = this.color_wheel_position;
    for (const [cell_index, cell] of layer.entries()) {
      const set_color = RainbowLib.colorWheel(color_wheel_position);
      for (const [segment_index, color] of cell.entries()) {
        if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
          continue;
        }
        layer.getCell(cell_index).setSegmentColor(segment_index, set_color);
      }
      color_wheel_position = RainbowLib.updateValue(color_wheel_position);
    }
  }

}

module.exports = SetToRainbowByCellOperator;
