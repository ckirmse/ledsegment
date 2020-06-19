'use strict';

const TerminalKit = require('terminal-kit');

const Display = require('./display');
const Layer = require('./layer');
const log = require('./log');

/*
 ---0---
 |\ | /|
 |\ c /|
 5 9|8 1
 | \|/ |
 |6- 7-|
 |  |  |
 | a|b |
 4/ d \2
 |/ | \|
 ---3---15

*/

const segment_map = {
  0: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],
  1: [[6, 1], [6, 2], [6, 3], [6, 4]],
  2: [[6, 6], [6, 7], [6, 8], [6, 9]],
  3: [[1, 10], [2, 10], [3, 10], [4, 10], [5, 10]],
  4: [[0, 6], [0, 7], [0, 8], [0, 9]],
  5: [[0, 1], [0, 2], [0, 3], [0, 4]],
  6: [[1, 5], [2, 5], [3, 5]],
  7: [[4, 5], [5, 5]],
  8: [[5, 1], [5, 2], [4, 3], [4, 4]],
  9: [[2, 4], [2, 3], [1, 2], [1, 1]],
  10: [[2, 6], [2, 7], [1, 8], [1, 9]],
  11: [[4, 6], [4, 7], [5, 8], [5, 9]],
  12: [[3, 1], [3, 2], [3, 3], [3, 4]],
  13: [[3, 6], [3, 7], [3, 8], [3, 9]],
  14: [[7, 10]],
};

const OUTPUT_SEGMENT_WIDTH = 8;
const OUTPUT_SEGMENT_HEIGHT = 11;

class OutputTerminal {

  constructor() {
    this.terminal = TerminalKit.terminal;
    this.terminal.fullscreen();
    this.screen_buffer = new TerminalKit.ScreenBufferHD({
      width: Display.getNumCells() * OUTPUT_SEGMENT_WIDTH,
      height: OUTPUT_SEGMENT_HEIGHT,
      dst: this.terminal,
      delta: true,
    });

    this.log_y = OUTPUT_SEGMENT_HEIGHT + 1;
  }

  destroy() {
    this.terminal.moveTo(0, OUTPUT_SEGMENT_HEIGHT + 1);
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
      this.log_y = OUTPUT_SEGMENT_HEIGHT + 1;
    }
  }

  render(action) {
    const output_layer = new Layer(Display.getNumCells());
    action.applyToLayer(output_layer);

    for (const [cell_index, segment_index, color] of output_layer.segmentEntries()) {
      const base_x = cell_index * OUTPUT_SEGMENT_WIDTH;
      const base_y = 0;
      for (const [x, y] of segment_map[segment_index]) {
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
