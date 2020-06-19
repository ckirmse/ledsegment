'use strict';

const Layer = require('./layer');
const GammaAction = require('./gamma_action');
const log = require('./log');

class OutputLed {

  constructor() {
    this.ws281x = require('./binding/ws281x.node');

    this.ws281x.init(120);
    this.pixel_data = new Uint32Array(120);

    this.gamma_action = new GammaAction();
  }

  destroy() {
    this.ws281x.reset();
    this.ws281x = null;
  }

  setBrightness(brightness) {
    this.ws281x.setBrightness(brightness);
  }

  log(...args) {
    console.log(...args);
  }

  render(action) {
    const output_layer = new Layer(8);
    action.applyToLayer(output_layer);
    this.gamma_action.applyToLayer(output_layer);

    let i = 0;
    for (const [cell_index, segment_index, color] of output_layer.segmentEntries()) {
      this.pixel_data[i] = (Math.floor(255 * color[1]) << 16) | (Math.floor(255 * color[0]) << 8) | Math.floor(255 * color[2]);
      i++;
    }

    this.ws281x.render(this.pixel_data);
  }

}

module.exports = OutputLed;
