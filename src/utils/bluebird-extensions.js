'use strict';

const Promise = require('bluebird');

function catchConsoleError() {
    return this
        .catch(function (err) {
            console.error(err.stack || err);
        });
}

Object.assign(Promise.prototype, {
    catchConsoleError: catchConsoleError,
});