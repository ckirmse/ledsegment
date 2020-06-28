'use strict';

const ws281x = require('rpi-ws281x-native');

const Layer = require('./layer');
const GammaAction = require('./actions/gamma');
const log = require('./log');

class OutputLed {

  constructor() {
    const num_leds = 120;
    ws281x.init(num_leds, {
      gpioNum: 12,
    });
    ws281x.setBrightness(90);

    this.pixel_data = new Uint32Array(num_leds);
  }

  destroy() {
    ws281x.reset();
  }

  log(...args) {
    console.log(...args);
  }

  render(action) {
    const output_layer = new Layer(8);
    action.applyToLayer(output_layer);

    let i = 0;
    for (const [cell_index, segment_index, color] of output_layer.segmentEntries()) {
      this.pixel_data[i] = (Math.floor(255 * color[1]) << 16) | (Math.floor(255 * color[0]) << 8) | Math.floor(255 * color[2]);
      i++;
    }

    ws281x.render(this.pixel_data);
  }

}

module.exports = OutputLed;
