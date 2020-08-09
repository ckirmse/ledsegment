'use strict';

const EaseLib = {
  // no easing, no acceleration
  linear: (t) => t,
  // accelerating from zero velocity
  easeInQuad: (t) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeIn: (t) => t * t * t,
  // decelerating to zero velocity
  easeOut: (t) => (--t) * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  // similar to easeOut
  sin: (t) => Math.sin(t * Math.PI / 2),
};

module.exports = EaseLib;
