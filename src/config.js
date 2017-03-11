'use strict';

module.exports = {
    monitorFilenames: ['cpu-monitor', 'memory-monitor', 'disk-monitor', 'network-monitor'],
    collectStatisticsInterval: 10 * 1000,
    sendStatisticsInterval: 10 * 1000,
    statsdConfig: {
        host: 'localhost'
    }
};