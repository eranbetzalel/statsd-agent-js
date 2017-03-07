'use strict';

const StatsDClient = require('statsd-client');
const config = require('../../config');

const debug = require('debug')('statsd-agent:statistic');

const statsdClient = new StatsDClient(config.statsdConfig);

class Statistic {
    constructor(statsdName, value) {
        this.statsdName = statsdName;
        this.value = value;
    }

    send() {
        debug('Sending statistic %s = %d', this.statsdName, this.value);

        statsdClient.gauge(this.statsdName, this.value);
    }
}

module.exports = Statistic;