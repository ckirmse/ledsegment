'use strict';

class Action {

  constructor(child_actions = []) {
    if (!Array.isArray(child_actions)) {
      throw new Error('ChildActionsNotArray');
    }
    this.child_actions = child_actions;

    this.width = Math.max(...this.child_actions.map((action) => action.getWidth()));
  }

  getWidth() {
    return this.width;
  }

  setWidth(width) {
    this.width = width;
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
      if (action.isDone()) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Action;
