'use strict';

const _ = require('underscore');
const config = require('../../config');

const Statistic = require('./statistic');

const debug = require('debug')('statsd-agent:monitor');

let statisticBlackList;

if (!_.isEmpty(config.statisticBlackList)) {
    statisticBlackList = new Set(config.statisticBlackList.map(statisticName => statisticName.toLowerCase()));
}

class Monitor {
    constructor(name) {
        this.name = name;
        this.statistics = [];
    }

    setStatistics(statisticsPairs) {
        debug('Setting statistics (%s)...', this.name, statisticsPairs);

        if (statisticBlackList) {
            statisticsPairs =
                statisticsPairs
                    .filter(statisticsPair => !statisticBlackList.has(`${this.name}.${statisticsPair[0]}`.toLowerCase()));
        }

        this.statistics =
            statisticsPairs
                .map(statisticsPair =>
                    new Statistic(`${this.name}.${statisticsPair[0]}`, statisticsPair[1]));
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