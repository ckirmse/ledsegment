'use strict';

const seedrandom = require('seedrandom');

const Cell = require('../cell');
const log = require('../log');
const TimedAction = require('../timed_action');

const randomShuffleArray = function (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};


class UnlockAction extends TimedAction {

  constructor(options = {}) {
    const {
      char_fps = 15,
    } = options;

    super(options);

    this.char_ms = 1000 / char_fps;

    this.reset();
  }

  reset() {
    super.reset();
    this.permutation = null;
  }

  applyToLayerWithProgress(layer, progress_frac) {

    if (!this.permutation) {
      // we lazy initialize this to be able to look at the data the first time and ignore "spaces"
      this.permutation = new Map();

      const cell_order = [];
      for (const [cell_index, cell] of layer.entries()) {
        for (const color of cell) {
          if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
            continue;
          }
          cell_order.push(cell_index);
          break;
        }
      }
      randomShuffleArray(cell_order);
      for (const [order, cell_index] of cell_order.entries()) {
        this.permutation.set(cell_index, order);
      }
    }

    if (this.permutation.size === 0) {
      return;
    }

    const num_characters = Cell.getNumCharacters();

    for (const [cell_index, cell] of layer.entries()) {
      if (!this.permutation.has(cell_index)) {
        continue;
      }

      const order = this.permutation.get(cell_index);
      const correct_time = (order + 0.999) / this.permutation.size;
      if (progress_frac > correct_time) {
        continue;
      }
      const seed = cell_index * 5000 + Math.floor((progress_frac * this.getTotalMs()) / this.char_ms);
      const rng = seedrandom(seed);
      let rand = rng();
      cell.setCharacterColor(Cell.getCharacterByIndex(Math.floor(rand * num_characters)), [1, 1, 1]);
    }
  }

}

module.exports = UnlockAction;
