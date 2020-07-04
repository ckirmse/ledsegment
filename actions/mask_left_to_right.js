'use strict';

const Cell = require('../cell');
const log = require('../log');
const TimedAction = require('../timed_action');

class MaskLeftToRightAction extends TimedAction {

  constructor(options = {}) {
    const {
      turn_on = true,
      reverse_direction = false,
      transition_frac = 0.2,
    } = options;

    super(options);

    this.turn_on = turn_on;
    this.reverse_direction = reverse_direction;
    this.transition_frac = transition_frac;
  }

  applyToLayerWithProgress(layer, progress_frac) {
    const grid_width = Cell.getGridWidth()
    const display_grid_width = layer.getNumCells() * grid_width;

    const transition_frac = this.transition_frac;

    // before fill_x, everything is solid
    const fill_x = display_grid_width * (progress_frac * (1 + transition_frac) - transition_frac);
    // past start_fill_x and before fill_x we're fading it in
    // before start_fill_x, completely masked out
    const start_fill_x = display_grid_width * Math.min(progress_frac / (1 - transition_frac), 1);

    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        continue;
      }

      const grid_coords = Cell.getSegmentGridCoords(segment_index);
      let count_filled = 0;
      for (const [x, _] of grid_coords) {
        let display_x = (cell_index * grid_width) + x;
        if (this.reverse_direction) {
          display_x = (layer.getNumCells() * grid_width) - display_x;
        }
        if (display_x < fill_x) {
          count_filled++;
          continue;
        }
        if (display_x > start_fill_x) {
          continue;
        }
        count_filled += (start_fill_x - display_x) / (start_fill_x - fill_x)
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

module.exports = MaskLeftToRightAction;
