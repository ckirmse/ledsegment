'use strict';

const TimedAction = require('../timed_action');
const log = require('../log');

/*
segment indexes (in hex for readability):
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
 ---3---e
*/

const snake_pattern = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
  [6, 0],
  [7, 0],
  [7, 1],
  [7, 2],
  [7, 3],
  [6, 3],
  [5, 3],
  [4, 3],
  [3, 3],
  [2, 3],
  [1, 3],
  [0, 3],
  [0, 4],
  [0, 5],

  [0, 9],
  [0, 11],
  [0, 14],
  [1, 10],
  [1, 8],
  [2, 9],
  [2, 11],
  [2, 14],
  [3, 10],
  [3, 8],
  [4, 9],
  [4, 11],
  [4, 14],
  [5, 10],
  [5, 8],
  [6, 9],
  [6, 11],
  [6, 14],
  [7, 10],
  [7, 8],

  [7, 1],
  [7, 2],

  [7, 11],
  [7, 9],
  [6, 8],
  [6, 10],
  [5, 14],
  [5, 11],
  [5, 9],
  [4, 8],
  [4, 10],
  [3, 14],
  [3, 11],
  [3, 9],
  [2, 8],
  [2, 10],
  [1, 14],
  [1, 11],
  [1, 9],
  [0, 8],
  [0, 10],

  [0, 4],

  [0, 6],
  [0, 7],
  [1, 6],
  [1, 7],
  [2, 6],
  [2, 7],
  [3, 6],
  [3, 7],
  [4, 6],
  [4, 7],
  [5, 6],
  [5, 7],
  [6, 6],
  [6, 7],
  [7, 6],
  [7, 7],

  [7, 6],
  [6, 7],
  [6, 6],
  [5, 7],
  [5, 6],
  [4, 7],
  [4, 6],
  [3, 7],
  [3, 6],
  [2, 7],
  [2, 6],
  [1, 7],
  [1, 6],
  [0, 7],
  [0, 6],

  [0, 5],
];

class SnakeAction extends TimedAction {

  constructor(options = {}) {
    const {
      transition_frac = 0.9, // fraction of each segment's fair share for it to fade in/out
      full_frac = 2.9, // fraction of each segment's fair share for it to be solid
    } = options;

    super(options);

    this.transition_frac = transition_frac;
    this.full_frac = full_frac;
  }

  applyToLayerWithProgress(layer, progress_frac) {
    let total_count = snake_pattern.length;

    for (let i = 0; i < total_count; i++) {
      let intensity = 0;

      let start_time = i / total_count;
      let start_full_time = (i + this.transition_frac) / total_count;
      let end_full_time = (i + this.transition_frac + this.full_frac) / total_count;
      let end_time = (i + this.transition_frac + this.full_frac + this.transition_frac) / total_count;

      // need to pretend progress_frac is 3 different values to get wrap-around at the ends
      for (const pretend_frac of [progress_frac - 1, progress_frac, progress_frac + 1]) {
        if (pretend_frac < start_time) {
          continue;
        }
        if (pretend_frac > end_time) {
          continue;
        }

        if (pretend_frac < start_full_time) {
          intensity = (pretend_frac - start_time) / (start_full_time - start_time);
        } else if (pretend_frac < end_full_time) {
          intensity = 1;
        } else {
          intensity = 1 - ((pretend_frac - end_full_time) / (end_time - end_full_time));
        }
        const cell_index = snake_pattern[i][0];
        const segment_index = snake_pattern[i][1];
        layer.getCell(cell_index).setSegmentColor(segment_index, [intensity, intensity, intensity]);
      }
    }
  }
}

module.exports = SnakeAction;
