'use strict';

class Action {

  constructor(options = {}) {
    const {
      type = 'unknown',
      child_actions = [],
    } = options;
    if (!Array.isArray(child_actions)) {
      throw new Error('ChildActionsNotArray');
    }
    this.type = type;
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

  getStatusIsDone() {
    return {
      type: this.type,
      is_done: this.isDone(),
      child_actions: this.child_actions.map((action) => action.getStatusIsDone()),
    };
  }
}

module.exports = Action;
