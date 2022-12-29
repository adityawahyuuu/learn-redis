const config = require('better-config');
const timeUtils = require('../utils/mine_time_utils');

// Prefix that all keys will start with, taken from config.json
const prefix = config.get('databaseStore.redis.keyPrefix');

const getKey = key => `${prefix}:${key}`;
const getSiteHashKey = siteId => getKey(`sites:info:${siteId}`);
const getSiteIDsKey = () => getKey(`sites:ids`);

const setPrefix = (newPrefix) => {
    prefix = newPrefix;
}

module.exports = {
    getSiteHashKey,
    getSiteIDsKey,
    setPrefix
};