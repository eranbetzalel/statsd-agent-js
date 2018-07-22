'use strict';

const _ = require('underscore');
const os = require('os');
const StatsdClient = require('hot-shots');
const config = require('../config.js');

const statsdConfig = config.statsdConfig;

const statsdClient = new StatsdClient({
    host: statsdConfig.host,
    cacheDns: true,
    telegraf: true,
    errorHandler: err => console.error(err.stack || err),
    prefix: statsdConfig.prefix,
    globalTags: {host: os.hostname()}
});

if (statsdConfig.debug) {
    StatsdClient.prototype.sendMessage =
        _.wrap(StatsdClient.prototype.sendMessage, function (originalSendMessage, message, callback) {
            console.log('send metric', message);

            originalSendMessage.call(this, message, callback);
        });
}

module.exports = statsdClient;