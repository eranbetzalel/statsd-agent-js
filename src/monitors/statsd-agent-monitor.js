'use strict';

const Promise = require('bluebird');
const os = require('os');
const fs = Promise.promisifyAll(require('fs'));

const Monitor = require('./objects/monitor');

const numberOfTicksPerSecond = 100;
const ticksInMicrosecond = 100000 / numberOfTicksPerSecond;
const numberOfCpus = os.cpus().length;
const platform = process.platform;
const hasProcessCpuUsage = process.cpuUsage != null && typeof process.cpuUsage === 'function';

if (platform !== 'linux' && !hasProcessCpuUsage) {
    throw new Error(`Monitor fails to find NodeJS v6.1.0+ or a linux platform`);
}

class StatsdAgentMonitor extends Monitor {
    constructor() {
        super('statsd_agent');
    }

    collect() {
        this.getProcessCpuUsage(this.lastProcessCpuUsage)
            .then(lastProcessCpuUsage => {
                if (this.lastProcessCpuUsage != null) {
                    const lastCollectIntervalMicroseconds = (Date.now() - this.lastCollectTime) * numberOfCpus * 1000;

                    this.setStatistics([
                        ['user', ((lastProcessCpuUsage.user / lastCollectIntervalMicroseconds) * 100).toFixed(2)],
                        ['system', ((lastProcessCpuUsage.system / lastCollectIntervalMicroseconds) * 100).toFixed(2)],
                    ]);
                }

                this.lastProcessCpuUsage = lastProcessCpuUsage;
                this.lastCollectTime = Date.now();
            })
            .catchConsoleError();
    }

    getProcessCpuUsage(lastProcessCpuUsage) {
        if (hasProcessCpuUsage) {
            return Promise.resolve(process.cpuUsage(lastProcessCpuUsage));
        }

        return fs
            .readFileAsync(`/proc/${process.pid}/stat`)
            .then(data => {
                const procParts = data.toString().split(' ');

                const userTime = parseInt(procParts[13]) * ticksInMicrosecond;
                const systemTime = parseInt(procParts[14]) * ticksInMicrosecond;

                if (lastProcessCpuUsage == null) {
                    return {user: userTime, system: systemTime};
                } else {
                    return {
                        user: userTime - lastProcessCpuUsage.user,
                        system: systemTime - lastProcessCpuUsage.system
                    };
                }
            });
    }
}

module.exports = StatsdAgentMonitor;