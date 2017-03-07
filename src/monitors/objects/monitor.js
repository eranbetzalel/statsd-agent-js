'use strict';

const os = require('os');
const changeCase = require('change-case');

const Statistic = require('./statistic');

const debug = require('debug')('statsd-agent:monitor');

const hostname = changeCase.snakeCase(os.hostname());

class Monitor {
    constructor(name) {
        this.name = name;
        this.statistics = [];
    }

    setStatistics(statisticsPairs) {
        debug('Setting statistics...', statisticsPairs);

        this.statistics =
            statisticsPairs.map(
                statisticsPair => new Statistic(`${hostname}.${this.name}.${statisticsPair[0]}`, statisticsPair[1]));
    }

    sendStatistics() {
        debug('Sending statistics...');

        const statistics = this.statistics;

        for (let i = 0; i < statistics.length; i++) {
            const statistic = statistics[i];

            statistic.send();
        }
    }

    clearStatistics() {
        this.statistics = [];
    }
}

module.exports = Monitor;