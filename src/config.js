'use strict';

const fs = require('fs-extra');
const path = require('path');

let customConfig;

function loadCustomConfiguration() {
    if (fs.existsSync(__dirname + '/config.custom.js')) {
        console.log('Loading custom configuration...');

        customConfig = require('./config.custom');
    } else {
        console.log('Creating custom configuration file...');

        fs.copySync(__dirname + '/config.default.js', __dirname + '/config.custom.js');

        loadCustomConfiguration();
    }
}

loadCustomConfiguration();

module.exports = customConfig;