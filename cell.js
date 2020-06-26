'use strict';

const Characters = require('./characters');
const log = require('./log');

const NUM_SEGMENTS = 15;

/*
segment indexes:
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

const segment_grid_coords_map = {
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

const GRID_WIDTH = 8;
const GRID_HEIGHT = 11;

class Cell {

  constructor() {
    this.segments = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      // colors are stored as array of [red, green, blue] in range 0-1
      this.segments.push([0, 0, 0]);
    }
  }

  static getNumSegments() {
    return NUM_SEGMENTS;
  }

  static getSegmentGridCoords(segment_index) {
    return segment_grid_coords_map[segment_index];
  }

  static getGridWidth() {
    return GRID_WIDTH;
  }

  static getGridHeight() {
    return GRID_HEIGHT;
  }

  clear() {
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      this.segments[i] = [0, 0, 0];
    }
  }

  getState() {
    const retval = {
      segments: []
    };
    for (const segment of this.segments) {
      retval.segments.push(segment.slice());
    }
    return retval;
  }

  setState(state) {
    this.segments = state.segments;
  }

  getSegmentColor(segment_index) {
    if (segment_index < 0 || segment_index >= NUM_SEGMENTS) {
      log.error('invalid segment_index to get', segment_index);
      throw new Error('InvalidSegmentIndex');
    }
    return this.segments[segment_index];
  }

  setSegmentColor(segment_index, color) {
    if (segment_index < 0 || segment_index >= NUM_SEGMENTS) {
      log.error('invalid segment_index to set', segment_index);
      throw new Error('InvalidSegmentIndex');
    }

    this.segments[segment_index][0] = color[0];
    this.segments[segment_index][1] = color[1];
    this.segments[segment_index][2] = color[2];
  }

  setCharacterColor(ch, color) {
    const segment_bits = Characters.getSegmentBitsForCharacter(ch);
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      if (segment_bits & (1 << i)) {
        this.segments[i] = color.slice();
      } else {
        this.segments[i] = [0, 0, 0];
      }
    }
  }

  setAllSegmentsColor(color) {
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      this.segments[i] = color.slice();
    }
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      yield this.segments[i];
    }
  }

  *entries() {
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      yield [i, this.segments[i]];
    }
  }

}

module.exports = Cell;
