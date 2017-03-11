'use strict';

require('console-stamp')(console, {pattern: "dd HH:MM:ss.l"});
require('./utils/bluebird-extensions');

const config = require('./config');

const debug = require('debug')('statsd-agent');

const monitors = [];

function loadMonitors() {
    const monitorFilenames = config.monitorFilenames;

    for (let i = 0; i < monitorFilenames.length; i++) {
        const monitorFilename = monitorFilenames[i];

        try {
            const Monitor = require(`./monitors/${monitorFilename}.js`);

            monitors.push(new Monitor());
        } catch (err) {
            console.error(`Could not load monitor ${monitorFilename}`);
        }
    }

    console.log(`${monitors.length} monitors loaded.`);
}

function collectStatistics() {
    for (let i = 0; i < monitors.length; i++) {
        const monitor = monitors[i];

        debug(`Collecting statistics (${monitor.name} monitor)...`);
        monitor.collect();
        debug(`Collected statistics (${monitor.name} monitor)...`);
    }
}

function sendStatistics() {
    for (let i = 0; i < monitors.length; i++) {
        const monitor = monitors[i];

        debug(`Sending statistics (${monitor.name} monitor)...`);
        monitor.sendStatistics();
        debug(`Sent statistics (${monitor.name} monitor).`);

        monitor.clearStatistics();
    }
}

function start() {
    loadMonitors();

    console.log('Start collecting statistics...');
    collectStatistics();
    setInterval(collectStatistics, config.collectStatisticsInterval);

    console.log('Start sending statistics...');
    setInterval(sendStatistics, config.sendStatisticsInterval);
}

start();