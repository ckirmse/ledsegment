'use strict';

const Cell = require('../cell');
const log = require('../log');
const TimedAction = require('../timed_action');

class MaskTopToBottomAction extends TimedAction {

  constructor(options = {}) {
    const {
      turn_on = true,
      transition_frac = 0.2,
    } = options;

    super(options);

    this.turn_on = turn_on;
    this.transition_frac = transition_frac;
  }

  applyToLayerWithProgress(layer, progress_frac) {
    const grid_height = Cell.getGridHeight()

    const transition_frac = this.transition_frac;

    // before fill_y, everything is solid
    const fill_y = grid_height * (progress_frac * (1 + transition_frac) - transition_frac);
    // past start_fill_y and before fill_y we're fading it in
    // before start_fill_y, completely masked out
    const start_fill_y = grid_height * Math.min(progress_frac / (1 - transition_frac), 1);

    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        continue;
      }

      const grid_coords = Cell.getSegmentGridCoords(segment_index);
      let count_filled = 0;
      for (const [_, y] of grid_coords) {
        if (y < fill_y) {
          count_filled++;
          continue;
        }
        if (y > start_fill_y) {
          continue;
        }
        count_filled += (start_fill_y - y) / (start_fill_y - fill_y)
      }

      let fill_ratio = count_filled / grid_coords.length;
      if (!this.turn_on) {
        fill_ratio = 1 - fill_ratio;
      }

      const masked_color = [
        color[0] * fill_ratio,
        color[1] * fill_ratio,
        color[2] * fill_ratio,
      ];

      layer.getCell(cell_index).setSegmentColor(segment_index, masked_color);
    }
  }
}

module.exports = MaskTopToBottomAction;
