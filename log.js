'use strict';

class Log {

  constructor() {
    this.output = null;
  }

  setOutput(output) {
    this.output = output;
  }

  log(...args) {
    this.output.log(...args);
  }

  info(...args) {
    this.log(...args);
  }

  error(...args) {
    this.log(...args);
  }
}

const singleton = new Log();

module.exports = singleton;
