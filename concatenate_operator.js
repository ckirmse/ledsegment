'use strict';

const Layer = require('./layer');
const log = require('./log');
const Operator = require('./operator');

class ConcatenateOperator extends Operator {

  constructor(child_operators = []) {
    super(child_operators);
    const sum_child_width = this.child_operators.map((operator) => operator.getWidth()).reduce((a, b) => a + b);
    this.setWidth(sum_child_width);
  }

  applyToLayer(layer) {
    let dest_index = 0;
    for (const operator of this.child_operators) {
      const temp_layer = new Layer(this.getWidth());
      operator.applyToLayer(temp_layer);
      temp_layer.copyToLayer(layer, 0, dest_index);
      dest_index += operator.getWidth();
    }
  }
}

module.exports = ConcatenateOperator;
