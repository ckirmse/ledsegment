'use strict';

const ColorLib = require('../color_lib');
const log = require('../log');
const Action = require('../action');
const RainbowLib = require('../rainbow_lib');

class RotateHueOverTime extends Action {

  constructor(options = {}) {
    const {
      cycle_ms = 10000,
    } = options;
    super(options);

    this.cycle_ms = cycle_ms;
    this.elapsed_ms = 0;
  }

  runTime(ms) {
    this.elapsed_ms += ms;
  }

  applyToLayer(layer) {
    let color_wheel_position = this.color_wheel_position;
    for (const [cell_index, cell] of layer.entries()) {
      const set_color = RainbowLib.colorWheel(color_wheel_position);
      for (const [segment_index, color] of cell.entries()) {
        if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
          continue;
        }
        const hsv = ColorLib.convertRgbToHsv(color);
        hsv[0] = (hsv[0] + (this.elapsed_ms / this.cycle_ms)) % 1;
        const output_color = ColorLib.convertHsvToRgb(hsv);

        layer.getCell(cell_index).setSegmentColor(segment_index, output_color);
      }
    }
  }

}

module.exports = RotateHueOverTime;
