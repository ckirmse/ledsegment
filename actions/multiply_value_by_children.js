'use strict';

const ColorLib = require('../color_lib');
const Layer = require('../layer');
const log = require('../log');
const Action = require('../action');

class MultiplyValueByChildrenAction extends Action {

  applyToLayer(layer) {
    // render children in a separate layer, then multiply the value and use their hue and saturation
    const child_layer = new Layer(layer.getNumCells());
    let dest_index = 0;
    for (const action of this.child_actions) {
      action.applyToLayer(child_layer);
    }


    for (const [cell_index, segment_index, input_color] of layer.segmentEntries()) {
      const multiply_color = child_layer.getCell(cell_index).getSegmentColor(segment_index);

      const input_hsv = ColorLib.convertRgbToHsv(input_color);
      const multiply_hsv = ColorLib.convertRgbToHsv(multiply_color);
      input_hsv[2] *= multiply_hsv[2];
      input_hsv[1] = multiply_hsv[1];
      input_hsv[0] = multiply_hsv[0];
      const output_color = ColorLib.convertHsvToRgb(input_hsv);

      layer.getCell(cell_index).setSegmentColor(segment_index, output_color);
    }
  }
}

module.exports = MultiplyValueByChildrenAction;
