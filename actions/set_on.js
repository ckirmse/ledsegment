'use strict';

const Action = require('../action');
const log = require('../log');

class SetOnAction extends Action {

  applyToLayer(layer) {
    for (const cell of layer) {
      cell.setAllSegmentsColor([1, 1, 1]);
    }
  }
}

module.exports = SetOnAction;
