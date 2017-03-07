'use strict';

class Average {
    constructor() {
        this.sum = 0;
        this.count = 0;
    }

    add(number) {
        this.sum += number;
        this.count++;

        return this;
    }

    calculateAverage() {
        return this.sum / this.count;
    }
}

module.exports = Average;