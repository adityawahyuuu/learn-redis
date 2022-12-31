const moment = require('moment');

const getCurrentTimestamp = () => moment().unix();
const getDateString = timestamp => moment.unix(timestamp).utc().format('YYYY-MM-DD');
const getMinuteOfDay = timestamp => {
    const t = (timestamp === undefined ? Math.floor(new Date().getTime() / 1000) : timestamp);
    const ts = moment.unix(t).utc();
    const dayStart = moment.unix(t).utc().startOf('day');

    return ts.diff(dayStart, 'minutes');
};
const getTimestampForMinuteOfDay = (timestamp, minute) => {
    const dayStart = moment.unix(timestamp).utc().startOf('day');

    return dayStart.add(minute, 'minutes').unix();
};

module.exports = {
    getCurrentTimestamp,
    getDateString,
    getMinuteOfDay,
    getTimestampForMinuteOfDay
};