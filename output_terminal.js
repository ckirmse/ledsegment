'use strict';

const TerminalKit = require('terminal-kit');

const Cell = require('./cell');
const Display = require('./display');
const Layer = require('./layer');
const log = require('./log');

class OutputTerminal {

  constructor() {
    this.terminal = TerminalKit.terminal;
    this.terminal.fullscreen();
    const grid_width = Cell.getGridWidth();
    const grid_height = Cell.getGridHeight();
    this.screen_buffer = new TerminalKit.ScreenBufferHD({
      width: Display.getNumCells() * grid_width,
      height: grid_height,
      dst: this.terminal,
      delta: true,
    });

    this.log_y = grid_height + 1;
  }

  destroy() {
    const grid_height = Cell.getGridHeight();
    this.terminal.moveTo(0, grid_height + 1);
  }

  setBrightness(brightness) {
  }

  log(...args) {
    this.terminal.moveTo(0, this.log_y);
    this.terminal.defaultColor();
    this.terminal.bgDefaultColor();
    console.log(...args);
    this.log_y++;
    if (this.log_y > 24) {
      const grid_height = Cell.getGridHeight();
      this.log_y = grid_height + 1;
    }
  }

  render(action) {
    const output_layer = new Layer(Display.getNumCells());
    action.applyToLayer(output_layer);

    const grid_width = Cell.getGridWidth();

    for (const [cell_index, segment_index, color] of output_layer.segmentEntries()) {
      const base_x = cell_index * grid_width;
      const base_y = 0;
      for (const [x, y] of Cell.getSegmentGridCoords(segment_index)) {
        this.screen_buffer.moveTo(base_x + x, base_y + y);
        this.screen_buffer.put({
          attr: {
            color: {
              r: Math.round(255 * color[0]),
              g: Math.round(255 * color[1]),
              b: Math.round(255 * color[2]),
            },
            bgColor: {
              r: Math.round(255 * color[0]),
              g: Math.round(255 * color[1]),
              b: Math.round(255 * color[2]),
            },
          }
        }, '*');
      }
    }
    this.screen_buffer.draw();
  }

}

module.exports = OutputTerminal;
