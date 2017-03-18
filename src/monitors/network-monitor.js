'use strict';

const _ = require('underscore');
const netstat = require('node-netstat');
const changeCase = require('change-case');

const Monitor = require('./objects/monitor');

class NetworkMonitor extends Monitor {
    constructor() {
        super('network');

        this.connectionsStatesCountStatsd = {};
    }

    collect() {
        const connections = [];

        netstat({
            filter: {
                protocol: 'tcp'
            },
            done: () => {
                const fullConnectionsStatesCount = this.getStatistics(connections);

                this.setStatistics(fullConnectionsStatesCount);
            }
        }, (connection) => connections.push(connection));
    }

    getStatistics(connections) {
        const connectionsStatesCount = _.countBy(connections, 'state');

        for (let connectionState in connectionsStatesCount) {
            this.connectionsStatesCountStatsd[changeCase.snakeCase(connectionState)] =
                connectionsStatesCount[connectionState];
        }

        return _.pairs(this.connectionsStatesCountStatsd);
    }
}

module.exports = NetworkMonitor;