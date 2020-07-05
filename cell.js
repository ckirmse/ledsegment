'use strict';

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

const character_map = {
  ' ': 0b0000000000000000,
  '!': 0b0100000000000110,
  '"': 0b0001000000000010,
  '#': 0b0011000011001110,
  '$': 0b0011000011101101,
  '%': 0b0011111111100100,
  '&': 0b0001101001011001,
  '\'': 0b0001000000000000,
  '(': 0b0000100100000000,
  ')': 0b0000011000000000,
  '*': 0b0011111111000000,
  '+': 0b0011000011000000,
  ',': 0b0000010000000000,
  '-': 0b0000000011000000,
  '.': 0b0100000000000000,
  '/': 0b0000010100000000,
  '0': 0b0000010100111111,
  '1': 0b0000000100000110,
  '2': 0b0000000011011011,
  '3': 0b0000000010001111,
  '4': 0b0000000011100110,
  '5': 0b0000100001101001,
  '6': 0b0000000011111101,
  '7': 0b0000000000000111,
  '8': 0b0000000011111111,
  '9': 0b0000000011101111,
  ':': 0b0011000000000000,
  ';': 0b0001010000000000,
  '<': 0b0000100101000000,
  '=': 0b0000000011001000,
  '>': 0b0000011010000000,
  '?': 0b0110000010000011,
  '@': 0b0001000010111011,
  'A': 0b0000000011110111,
  'B': 0b0011000010001111,
  'C': 0b0000000000111001,
  'D': 0b0011000000001111,
  'E': 0b0000000001111001,
  'F': 0b0000000001110001,
  'G': 0b0000000010111101,
  'H': 0b0000000011110110,
  'I': 0b0011000000001001,
  'J': 0b0000000000011110,
  'K': 0b0000100101110000,
  'L': 0b0000000000111000,
  'M': 0b0000001100110110,
  'N': 0b0000101000110110,
  'O': 0b0000000000111111,
  'P': 0b0000000011110011,
  'Q': 0b0000100000111111,
  'R': 0b0000100011110011,
  'S': 0b0000000011101101,
  'T': 0b0011000000000001,
  'U': 0b0000000000111110,
  'V': 0b0000010100110000,
  'W': 0b0000110000110110,
  'X': 0b0000111100000000,
  'Y': 0b0000000011101110,
  'Z': 0b0000010100001001,
  '[': 0b0000000000111001,
  '\\': 0b0000101000000000,
  ']': 0b0000000000001111,
  '^': 0b0000110000000000,
  '_': 0b0000000000001000,
  '`': 0b0000001000000000,
  'a': 0b0010000001011000,
  'b': 0b0000100001111000,
  'c': 0b0000000011011000,
  'd': 0b0000010010001110,
  'e': 0b0000010001011000,
  'f': 0b0010000111000000,
  'g': 0b0000000110001110,
  'h': 0b0010000001110000,
  'i': 0b0010000000000000,
  'j': 0b0001010000010000,
  'k': 0b0011100100000000,
  'l': 0b0000000000110000,
  'm': 0b0010000011010100,
  'n': 0b0010000001010000,
  'o': 0b0000000011011100,
  'p': 0b0000001001110000,
  'q': 0b0000000110000110,
  'r': 0b0000000001010000,
  's': 0b0000100010001000,
  't': 0b0000000001111000,
  'u': 0b0000000000011100,
  'v': 0b0000010000010000,
  'w': 0b0000110000010100,
  'x': 0b0000111100000000,
  'y': 0b0001000010001110,
  'z': 0b0000010001001000,
  '{': 0b0000011001001001,
  '|': 0b0011000000000000,
  '}': 0b0000100110001001,
  '~': 0b0000010111000000,
};

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

  static getNumCharacters() {
    return Object.keys(character_map).length;
  }

  static getCharacterByIndex(index) {
    return Object.keys(character_map)[index];
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
    let segment_bits = 0;
    if (Object.prototype.hasOwnProperty.call(character_map, ch)) {
      segment_bits = character_map[ch];
    }

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
