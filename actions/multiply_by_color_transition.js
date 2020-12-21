'use strict';

const Cell = require('../cell');
const log = require('../log');
const Action = require('../action');

class MultiplyByColorTransition extends Action {

  constructor(options = {}) {
    const {
      top_left_color = options.top_left_color ?? [1, 1, 1],
      top_right_color = options.top_right_color ?? [1, 1, 1],
      bottom_left_color = options.bottom_left_color ?? [1, 1, 1],
      bottom_right_color = options.bottom_right_color ?? [1, 1, 1],
    } = options;

    super(options);

    this.top_left_color = top_left_color;
    this.top_right_color = top_right_color;
    this.bottom_left_color = bottom_left_color;
    this.bottom_right_color = bottom_right_color;
  }

  applyToLayer(layer) {
    const grid_width = Cell.getGridWidth()
    const grid_height = Cell.getGridHeight()
    const display_grid_width = layer.getNumCells() * grid_width;

    for (const [cell_index, segment_index, input_color] of layer.segmentEntries()) {
    const grid_colors = [];
      const grid_coords = Cell.getSegmentGridCoords(segment_index);
      for (const [x, y] of grid_coords) {
        let display_x = (cell_index * grid_width) + x;
        const x_fraction = display_x / (display_grid_width - 1);
        const y_fraction = y / (grid_height - 1);
        grid_colors.push([
          (1 - y_fraction) * ((1 - x_fraction) * this.top_left_color[0] + x_fraction * this.top_right_color[0]) +
            y_fraction * ((1 - x_fraction) * this.bottom_left_color[0] + x_fraction * this.bottom_right_color[0]),
          (1 - y_fraction) * ((1 - x_fraction) * this.top_left_color[1] + x_fraction * this.top_right_color[1]) +
            y_fraction * ((1 - x_fraction) * this.bottom_left_color[1] + x_fraction * this.bottom_right_color[1]),
          (1 - y_fraction) * ((1 - x_fraction) * this.top_left_color[2] + x_fraction * this.top_right_color[2]) +
            y_fraction * ((1 - x_fraction) * this.bottom_left_color[2] + x_fraction * this.bottom_right_color[2]),
        ]);
      }
      const average_color = [];
      average_color.push(grid_colors.map((color) => color[0]).reduce((a, b) => a + b, 0) / grid_coords.length);
      average_color.push(grid_colors.map((color) => color[1]).reduce((a, b) => a + b, 0) / grid_coords.length);
      average_color.push(grid_colors.map((color) => color[2]).reduce((a, b) => a + b, 0) / grid_coords.length);

      let output_color;

      output_color = [
        input_color[0] * average_color[0],
        input_color[1] * average_color[1],
        input_color[2] * average_color[2],
      ];

      layer.getCell(cell_index).setSegmentColor(segment_index, output_color);
    }
  }
}

module.exports = MultiplyByColorTransition;
