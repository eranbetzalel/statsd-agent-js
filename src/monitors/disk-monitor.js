'use strict';

const Promise = require('bluebird');
const drivelist = Promise.promisifyAll(require('drivelist'));
const diskusage = Promise.promisifyAll(require('diskusage'));

const Monitor = require('./objects/monitor');

class DiskMonitor extends Monitor {
    constructor() {
        super('disk');
    }

    collect() {
        drivelist
            .listAsync()
            .map(device => {
                const deviceMountPath = device.mountpoints && device.mountpoints[0] && device.mountpoints[0].path;

                if (deviceMountPath == null)
                    return;

                return diskusage
                    .checkAsync(deviceMountPath)
                    .then(deviceInfo => {
                        const deviceMountPathStatsdName = deviceMountPath.replace(':', '');

                        return [
                            [`${deviceMountPathStatsdName}.available`, deviceInfo.available],
                            [`${deviceMountPathStatsdName}.free`, deviceInfo.free],
                            [`${deviceMountPathStatsdName}.total`, deviceInfo.total]
                        ];
                    })
                    .catch(err => {
                        console.error(err.stack || err);

                        return [];
                    });
            })
            .then(diskStatisticsList => {
                const allStatistics = [];

                for (let i = 0; i < diskStatisticsList.length; i++) {
                    const diskStatistics = diskStatisticsList[i];

                    Array.prototype.push.apply(allStatistics, diskStatistics);
                }

                this.setStatistics(allStatistics);
            })
            .catchConsoleError();
    }
}

module.exports = DiskMonitor;