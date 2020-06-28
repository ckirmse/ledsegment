'use strict';

const Layer = require('../layer');
const log = require('../log');
const TimedAction = require('../timed_action');

class FadeToChildrenAction extends TimedAction {

  applyToLayerWithProgress(layer, progress_frac) {
    // render children in a separate layer, then interpolate
    const child_layer = new Layer(layer.getNumCells());
    let dest_index = 0;
    for (const action of this.child_actions) {
      action.applyToLayer(child_layer);
    }

    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      const child_layer_color = child_layer.getCell(cell_index).getSegmentColor(segment_index);
      const output_color = [
        color[0] * (1 - progress_frac) + child_layer_color[0] * progress_frac,
        color[1] * (1 - progress_frac) + child_layer_color[1] * progress_frac,
        color[2] * (1 - progress_frac) + child_layer_color[2] * progress_frac,
      ];

      layer.getCell(cell_index).setSegmentColor(segment_index, output_color);
    }
  }
}

module.exports = FadeToChildrenAction;
