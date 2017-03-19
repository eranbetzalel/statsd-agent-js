'use strict';

const os = require('os');
const numberOfCpus = os.cpus().length;
const Monitor = require('./objects/monitor');

class StatsdAgentMonitor extends Monitor {
    constructor() {
        super('statsd_agent');
    }

    collect() {
        const lastProcessCpuUsage = process.cpuUsage(this.lastProcessCpuUsage);

        if (this.lastProcessCpuUsage != null) {
            const lastCollectIntervalMicroseconds = (Date.now() - this.lastCollectTime) * numberOfCpus * 1000;

            this.setStatistics([
                ['user', ((lastProcessCpuUsage.user / lastCollectIntervalMicroseconds) * 100).toFixed(2)],
                ['system', ((lastProcessCpuUsage.system / lastCollectIntervalMicroseconds) * 100).toFixed(2)],
            ]);
        }

        this.lastProcessCpuUsage = lastProcessCpuUsage;
        this.lastCollectTime = Date.now();
    }
}

module.exports = StatsdAgentMonitor;