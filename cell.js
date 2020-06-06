'use strict';

const Characters = require('./characters');

const COUNT_SEGMENTS = 15;

class Cell {

  constructor() {
    this.segments = [];
    for (let i = 0; i < COUNT_SEGMENTS; i++) {
      this.segments[i] = 0;
    }
  }

  static getCountSegments() {
    return COUNT_SEGMENTS;
  }

  getSegmentColor(segment_index) {
    return this.segments[segment_index];
  }

  setSegmentColor(segment_index, color) {
    this.segments[segment_index] = color;
  }

  setCharacterColor(ch, color) {
    const segment_bits = Characters.getSegmentBitsForCharacter(ch);
    for (let i = 0; i < COUNT_SEGMENTS; i++) {
      if (segment_bits & (1 << i)) {
        this.segments[i] = color;
      } else {
        this.segments[i] = 0;
      }
    }
  }
}

module.exports = Cell;
