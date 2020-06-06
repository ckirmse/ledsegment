'use strict';

const Characters = require('./characters');
const log = require('./log');

const NUM_SEGMENTS = 15;

class Cell {

  constructor() {
    this.segments = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      this.segments[i] = 0;
    }
  }

  static getNumSegments() {
    return NUM_SEGMENTS;
  }

  clear() {
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      this.segments[i] = 0;
    }
  }

  getState() {
    return {
      segments: [...this.segments],
    };
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

    this.segments[segment_index] = color;
  }

  setCharacterColor(ch, color) {
    const segment_bits = Characters.getSegmentBitsForCharacter(ch);
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      if (segment_bits & (1 << i)) {
        this.segments[i] = color;
      } else {
        this.segments[i] = 0;
      }
    }
  }
}

module.exports = Cell;
