'use strict';

const changeCase = require('change-case');
const statsdUtil = require('../../utils/statsd-util');

const debug = require('debug')('statsd-agent:statistic');

class Statistic {
    constructor(statsdName, value) {
        this.statsdName = statsdName.split('.').map(s => changeCase.snakeCase(s)).join('.');
        this.value = value;
    }

    send() {
        debug('Sending statistic %s = %d', this.statsdName, this.value);

        statsdUtil.gauge(this.statsdName, this.value);
    }
}

module.exports = Statistic;