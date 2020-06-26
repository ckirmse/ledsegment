'use strict';

const Cell = require('./cell');
const log = require('./log');
const TimedAction = require('./timed_action');

class MaskTopToBottomAction extends TimedAction {

  constructor(options = {}) {
    const {
      turn_on = true,
    } = options;

    super(options);

    this.turn_on = options.turn_on;
  }

  applyToLayerWithProgress(layer, progress_frac) {
    const grid_height = Cell.getGridHeight()

    const fill_y = Math.floor(grid_height * progress_frac);
    for (const [cell_index, segment_index, color] of layer.segmentEntries()) {
      if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        continue;
      }

      const grid_coords = Cell.getSegmentGridCoords(segment_index);
      let count_filled = 0;
      for (const [_, y] of grid_coords) {
        if (y < fill_y) {
          count_filled++;
        }
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
