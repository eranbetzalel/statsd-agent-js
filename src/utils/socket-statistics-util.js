'use strict';

const Promise = require('bluebird');
const childProcess = require('child_process');
const changeCase = require('change-case');
const readline = require('readline');

const command = {
    cmd: 'ss',
    args: ['-tan']
};

function getTcpStateCounts() {
    return new Promise((resolve, reject) => {
        const proc = childProcess.spawn(command.cmd, command.args);

        proc.on('error', reject);

        const tcpStateCounts = {};

        const lineReader = readline.createInterface({
            input: proc.stdout
        });

        let isFirstLine = true;

        lineReader.on('line', line => {
            if (isFirstLine) {
                isFirstLine = false;

                return;
            }

            const firstSeparator = line.indexOf(' ');

            const status = line.substr(0, firstSeparator);

            const statusSnakeCase = changeCase.snakeCase(status);

            tcpStateCounts[statusSnakeCase] = (tcpStateCounts[statusSnakeCase] || 0) + 1;
        });

        proc.stdout.on('close', () => {
            resolve(tcpStateCounts);
        });
    });
}

module.exports = {
    getTcpStateCounts: getTcpStateCounts
};