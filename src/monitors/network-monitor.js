'use strict';

const _ = require('underscore');
const netstat = require('node-netstat');

const Monitor = require('./objects/monitor');

class NetworkMonitor extends Monitor {
    constructor() {
        super('network');
    }

    collect() {
        const connections = [];

        netstat({
            filter: {
                protocol: 'tcp'
            },
            done: (x, y) => this.setStatistics(_.chain(connections).countBy('state').pairs().value())
        }, (connection) => connections.push(connection));
    }
}

module.exports = NetworkMonitor;