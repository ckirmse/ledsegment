'use strict';

const Layer = require('../layer');
const log = require('../log');
const Action = require('../action');

class MultiplyByChildrenAction extends Action {

  applyToLayer(layer) {
    // render children in a separate layer, then multiply
    const child_layer = new Layer(layer.getNumCells());
    let dest_index = 0;
    for (const action of this.child_actions) {
      action.applyToLayer(child_layer);
    }


    for (const [cell_index, segment_index, input_color] of layer.segmentEntries()) {
      const multiply_color = child_layer.getCell(cell_index).getSegmentColor(segment_index);

      const output_color = [
        input_color[0] * multiply_color[0],
        input_color[1] * multiply_color[1],
        input_color[2] * multiply_color[2],
      ];
      layer.getCell(cell_index).setSegmentColor(segment_index, output_color);
    }
  }
}

module.exports = MultiplyByChildrenAction;
