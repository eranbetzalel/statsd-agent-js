'use strict';

const os = require('os');

const Monitor = require('./objects/monitor');

class MemoryMonitor extends Monitor {
    constructor() {
        super('memory');
    }

    collect() {
        const freemem = os.freemem();
        const totalmem = os.totalmem();

        this.setStatistics([
            ['free', freemem],
            ['total', totalmem],
            ['used', totalmem - freemem],
        ]);
    }
}

module.exports = MemoryMonitor;