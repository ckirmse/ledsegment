'use strict';

class Log {

  info(...args) {
    console.log(...args);
  }

  error(...args) {
    console.log(...args);
  }
}

const singleton = new Log();

module.exports = singleton;
