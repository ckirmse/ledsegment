'use strict';

class Mode {

  constructor(operators) {
    this.operators = operators;
  }

  init(display) {
    for (const operator of this.operators) {
      operator.init(display);
    }
  }

  runTime(ms) {
    for (const operator of this.operators) {
      operator.runTime(ms);
    }
  }

  applyToLayer(layer) {
    for (const operator of this.operators) {
      operator.applyToLayer(layer);
    }
  }

  isDone() {
    for (const operator of this.operators) {
      if (operator.isDone()) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Mode;
