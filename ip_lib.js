'use strict';

const os = require('os');

const IpLib = {};

IpLib.getIpAddresses = function () {
  const nets = os.networkInterfaces();
  const retval = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        retval.push(net.address);
      }
    }
  }
  if (retval.length === 0) {
    retval.push('127.0.0.1');
  }
  return retval;
};

module.exports = IpLib;
