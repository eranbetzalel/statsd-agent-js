'use strict';

const os = require('os');

const Monitor = require('./objects/monitor');
const Average = require('../utils/average');

class CpuMonitor extends Monitor {
    constructor() {
        super('cpu');
    }

    collect() {
        const cpus = os.cpus();

        let maxCpuTimes = {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        };

        let avgCpuTimes = {
            user: new Average(),
            nice: new Average(),
            sys: new Average(),
            idle: new Average(),
            irq: new Average()
        };

        let minCpuTimes = {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        };

        for (let i = 0; i < cpus.length; i++) {
            const cpu = cpus[i];

            const cpuTimes = cpu.times;

            minCpuTimes = {
                user: Math.min(minCpuTimes.user, cpuTimes.user),
                nice: Math.min(minCpuTimes.nice, cpuTimes.nice),
                sys: Math.min(minCpuTimes.sys, cpuTimes.sys),
                idle: Math.min(minCpuTimes.idle, cpuTimes.idle),
                irq: Math.min(minCpuTimes.irq, cpuTimes.irq)
            };

            avgCpuTimes.user.add(cpuTimes.user);
            avgCpuTimes.nice.add(cpuTimes.nice);
            avgCpuTimes.sys.add(cpuTimes.sys);
            avgCpuTimes.idle.add(cpuTimes.idle);
            avgCpuTimes.irq.add(cpuTimes.irq);

            maxCpuTimes = {
                user: Math.max(maxCpuTimes.user, cpuTimes.user),
                nice: Math.max(maxCpuTimes.nice, cpuTimes.nice),
                sys: Math.max(maxCpuTimes.sys, cpuTimes.sys),
                idle: Math.max(maxCpuTimes.idle, cpuTimes.idle),
                irq: Math.max(maxCpuTimes.irq, cpuTimes.irq)
            };
        }

        this.setStatistics([
            ['times.user.max', maxCpuTimes.user],
            ['times.nice.max', maxCpuTimes.nice],
            ['times.sys.max', maxCpuTimes.sys],
            ['times.idle.max', maxCpuTimes.idle],
            ['times.irq.max', maxCpuTimes.irq],
            ['times.user.avg', avgCpuTimes.user.calculateAverage()],
            ['times.nice.avg', avgCpuTimes.nice.calculateAverage()],
            ['times.sys.avg', avgCpuTimes.sys.calculateAverage()],
            ['times.idle.avg', avgCpuTimes.idle.calculateAverage()],
            ['times.irq.avg', avgCpuTimes.irq.calculateAverage()],
            ['times.user.min', minCpuTimes.user],
            ['times.nice.min', minCpuTimes.nice],
            ['times.sys.min', minCpuTimes.sys],
            ['times.idle.min', minCpuTimes.idle],
            ['times.irq.min', minCpuTimes.irq]
        ]);
    }
}

module.exports = CpuMonitor;