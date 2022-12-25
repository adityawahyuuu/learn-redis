const Redis = require('redis');

const DEFAULT_EXPIRATION = 60;

const redisClient = Redis.createClient();

const getOrSetCache = (key, cb) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, async (error, data) => {
            if(error) return reject(error);
            if(data != null) return resolve(JSON.parse(data))
            const freshData = await cb();
            redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
            resolve(freshData);
        });
    });
};

module.exports = getOrSetCache