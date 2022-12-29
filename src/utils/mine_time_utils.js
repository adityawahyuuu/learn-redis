const moment = require('moment');

const getCurrentTimestampMillis = () => moment().valueOf();

module.exports = {
    getCurrentTimestampMillis
};