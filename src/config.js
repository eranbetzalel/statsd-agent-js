'use strict';

const fs = require('fs-extra');

let customConfig;

function loadCustomConfiguration() {
    if (fs.existsSync('./config.custom.js')) {
        console.log('Loading custom configuration...');

        customConfig = require('./config.custom');
    } else {
        console.log('Creating custom configuration file...');

        fs.copySync('./config.default.js', './config.custom.js');

        loadCustomConfiguration();
    }
}

loadCustomConfiguration();

module.exports = customConfig;