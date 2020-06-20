'use strict';

const Layer = require('./layer');
const Action = require('./action');
const log = require('./log');

class StaticMessageAction extends Action {

  constructor({
    message = '',
  } = {}) {
    super();

    this.message = message;
    this.setWidth(this.message.length);

    this.layer = new Layer(this.width);

    for (const [cell_index, cell] of this.layer.entries()) {
      cell.setCharacterColor(this.message[cell_index], [1, 1, 1]);
    }
  }

  applyToLayer(layer) {
    this.layer.copyToLayer(layer);
  }
}

module.exports = StaticMessageAction;
