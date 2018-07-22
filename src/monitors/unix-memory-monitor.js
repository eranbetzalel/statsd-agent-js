'use strict';

const free = require('free-memory');

const Monitor = require('./objects/monitor');

const kilobyteToByte = kb => kb * 1024;

class MemoryMonitor extends Monitor {
    constructor() {
        super('memory');
    }

    collect() {
      free((err, { mem }) => {
        if (err) throw err;

        this.setStatistics([
          ['free', kilobyteToByte(mem.usable)],
          ['total', kilobyteToByte(mem.total)],
          ['used', kilobyteToByte(mem.total - mem.usable)],
        ]);
      })
    }
}

module.exports = MemoryMonitor;