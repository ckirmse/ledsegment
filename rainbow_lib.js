'use strict';

const RainbowLib = {};

RainbowLib.getRandomInitialValue = function () {
  return Math.floor(255 * Math.random());
}

RainbowLib.updateValue = function (in_pos) {
  return (in_pos + 30) % 255;
}

// rainbow-colors, taken from http://goo.gl/Cs3H0v
RainbowLib.colorWheel = function (in_pos) {
  let pos = 255 - in_pos;
  if (pos < 85) {
    return [(255 - pos * 3) / 255, 0, pos * 3 / 255];
  }
  else if (pos < 170) {
    pos -= 85;
    return [0, pos * 3 / 255, (255 - pos * 3) / 255];
  }
  else {
    pos -= 170;
    return [(pos * 3) / 255, (255 - pos * 3) / 255, 0];
  }
}

module.exports = RainbowLib;
