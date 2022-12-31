const config = require('better-config');
const redis = require('../daos/mine_redis_client');
const keyGenerator = require('../daos/mine_redis_key_generator');
const timeUtils = require('../utils/mine_time_utils');
const redisMetricDAO = require('../daos/mine_metric_dao_redis_impl');

config.set('../../config.json');
const testSuiteName = 'metric_dao_redis_impl';
const testKeyPrefix = `test:${testSuiteName}`;
keyGenerator.setPrefix(testKeyPrefix);

const client = redis.getClient();

const sampleReadings = [];

const getSampleReadings = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let time = timeUtils.getCurrentTimestamp();
        
            for (let n = 0; n < 72 * 60; n += 1) {
                const reading = {
                    siteId: 1,
                    whUsed: n,
                    whGenerated: n,
                    tempC: n,
                    dateTime: time,
                };
        
                sampleReadings.push(reading);
        
                // Set time to one minute earlier.
                time -= 60;
            }
            resolve(sampleReadings);
        }, 1000);
    })
};

const testInsertAndRetrieve = async (limit=undefined) => {
    const sampleReading = await getSampleReadings();
    for (sample of sampleReading){
        await redisMetricDAO.insert(sample);
    };
    const getData = await redisMetricDAO.getRecent(1, 'whGenerated', timeUtils.getCurrentTimestamp(), limit);
    console.log(getData);
    client.quit();
};

// testInsertAndRetrieve(10);