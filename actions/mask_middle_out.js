'use strict';

const Layer = require('../layer');
const log = require('../log');
const MaskLeftToRightAction = require('./mask_left_to_right');
const TimedAction = require('../timed_action');

class MaskMiddleOutAction extends TimedAction {

  constructor(options = {}) {
    const {
      turn_on = true,
      reverse_direction = false,
      transition_frac = 0.2,
    } = options;

    super(options);

    this.turn_on = turn_on;
    this.reverse_direction = reverse_direction;
    this.transition_frac = transition_frac;
  }


  applyToLayerWithProgress(layer, progress_frac) {
    const split_index = Math.ceil(layer.getNumCells() / 2);

    const layer_left = new Layer(split_index);
    layer.copyToLayer(layer_left, 0, 0);
    const left_mask = new MaskLeftToRightAction({
      turn_on: this.turn_on,
      reverse_direction: !this.reverse_direction,
      transition_frac: this.transition_frac,
    });
    left_mask.applyToLayerWithProgress(layer_left, progress_frac);
    layer_left.copyToLayer(layer, 0, 0);

    const layer_right = new Layer(layer.getNumCells() - split_index);
    layer.copyToLayer(layer_right, split_index, 0);
    const right_mask = new MaskLeftToRightAction({
      turn_on: this.turn_on,
      reverse_direction: this.reverse_direction,
      transition_frac: this.transition_frac,
    });
    right_mask.applyToLayerWithProgress(layer_right, progress_frac);

    layer_right.copyToLayer(layer, 0, split_index);

  }

}

module.exports = MaskMiddleOutAction;
