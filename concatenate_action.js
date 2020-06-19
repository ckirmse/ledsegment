'use strict';

const Layer = require('./layer');
const log = require('./log');
const Action = require('./action');

class ConcatenateAction extends Action {

  constructor(child_actions = []) {
    super(child_actions);
    const sum_child_width = this.child_actions.map((action) => action.getWidth()).reduce((a, b) => a + b);
    this.setWidth(sum_child_width);
  }

  applyToLayer(layer) {
    let dest_index = 0;
    for (const action of this.child_actions) {
      const temp_layer = new Layer(this.getWidth());
      action.applyToLayer(temp_layer);
      temp_layer.copyToLayer(layer, 0, dest_index);
      dest_index += action.getWidth();
    }
  }
}

module.exports = ConcatenateAction;
