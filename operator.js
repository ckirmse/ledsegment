'use strict';

class Operator {

  constructor(child_operators = []) {
    if (!Array.isArray(child_operators)) {
      throw new Error('ChildOperatorsNotArray');
    }
    this.child_operators = child_operators;

    this.width = Math.max(...this.child_operators.map((operator) => operator.getWidth()));
  }

  getWidth() {
    return this.width;
  }

  setWidth(width) {
    this.width = width;
  }

  runTime(ms) {
    for (const operator of this.child_operators) {
      operator.runTime(ms);
    }
  }

  applyToLayer(layer) {
    for (const operator of this.child_operators) {
      operator.applyToLayer(layer);
    }
  }

  isDone() {
    for (const operator of this.child_operators) {
      if (operator.isDone()) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Operator;
