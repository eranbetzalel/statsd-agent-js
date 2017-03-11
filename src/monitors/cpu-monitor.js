'use strict';

const os = require('os');

const Monitor = require('./objects/monitor');

class CpuMonitor extends Monitor {
    constructor() {
        super('cpu');
    }

    collect() {
        const intervalCpuTimes = this.getIntervalCpuTimes();

        if (intervalCpuTimes == null)
            return;

        this.setStatistics([
            ['user', intervalCpuTimes.user],
            ['nice', intervalCpuTimes.nice],
            ['sys', intervalCpuTimes.sys],
            ['idle', intervalCpuTimes.idle],
            ['irq', intervalCpuTimes.irq]
        ])
    }

    getIntervalCpuTimes() {
        const newCpuTimes = this.getCpuTimes();

        if (this.currentCpuTimes == null) {
            this.currentCpuTimes = newCpuTimes;

            return null;
        }

        const intervalCpuTimes = {
            user: newCpuTimes.user - this.currentCpuTimes.user,
            nice: newCpuTimes.nice - this.currentCpuTimes.nice,
            sys: newCpuTimes.sys - this.currentCpuTimes.sys,
            idle: newCpuTimes.idle - this.currentCpuTimes.idle,
            irq: newCpuTimes.irq - this.currentCpuTimes.irq
        };

        this.currentCpuTimes = newCpuTimes;

        return intervalCpuTimes;
    }

    getCpuTimes() {
        const cpus = os.cpus();

        const newCpuTimes = {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        };

        for (let i = 0; i < cpus.length; i++) {
            let cpu = cpus[i];

            newCpuTimes.user += cpu.times.user;
            newCpuTimes.nice += cpu.times.nice;
            newCpuTimes.sys += cpu.times.sys;
            newCpuTimes.idle += cpu.times.idle;
            newCpuTimes.irq += cpu.times.irq;
        }

        return newCpuTimes;
    }
}

module.exports = CpuMonitor;