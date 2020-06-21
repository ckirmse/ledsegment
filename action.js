'use strict';

class Action {

  constructor(options = {}) {
    const {
      child_actions = [],
    } = options;
    if (!Array.isArray(child_actions)) {
      throw new Error('ChildActionsNotArray');
    }
    this.child_actions = child_actions;

    this.width = Math.max(0, ...this.child_actions.map((action) => action.getWidth()));
  }

  getWidth() {
    return this.width;
  }

  setWidth(width) {
    this.width = width;
  }

  resetAllChildren() {
    for (const action of this.child_actions) {
      action.reset();
    }
  }

  reset() {
    this.resetAllChildren();
  }

  runTime(ms) {
    for (const action of this.child_actions) {
      action.runTime(ms);
    }
  }

  applyToLayer(layer) {
    for (const action of this.child_actions) {
      action.applyToLayer(layer);
    }
  }

  isDone() {
    for (const action of this.child_actions) {
      if (!action.isDone()) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Action;
