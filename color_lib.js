'use strict';

const ColorLib = {};

ColorLib.convertRgbToHsv = function (color) {
  const [r, g, b] = color;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h;
  const s = (max === 0 ? 0 : d / max)
  const v = max;

  if (min === max) {
    h = 0;
  } else if (max === r) {
    h = ((g - b) + d * (g < b ? 6 : 0)) / (6 * d);
  } else if (max === g) {
    h = ((b - r) + d * 2) / (6 * d);
  } else {
    h = ((r - g) + d * 4) / (6 * d);

  }

  return [h, s, v];
};

ColorLib.convertHsvToRgb = function (color) {
  const [h, s, v] = color;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
  case 0:
    return [v, t, p];
  case 1:
    return [q, v, p];
  case 2:
    return [p, v, t];
  case 3:
    return [p, q, v];
  case 4:
    return [t, p, v];
  case 5:
  default:
    return [v, p, q];
  }
}

ColorLib.increaseBrightnessByFraction = function (color, frac) {
  let [h, s, v] = ColorLib.convertRgbToHsv(color);
  v += (1 - v) * frac;
  return ColorLib.convertHsvToRgb([h, s, v]);
};

module.exports = ColorLib;
