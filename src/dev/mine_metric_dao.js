const config = require('better-config');
const redis = require('../daos/mine_redis_client');
const keyGenerator = require('../daos/mine_redis_key_generator');
const timeUtils = require('../utils/mine_time_utils');
const redisMetricDAO = require('../daos/mine_metric_dao_redis_impl');

config.set('../../config.json');
const testSuitName = 'metric_dao_redis_impl';
const testKeyPrefix = `test:${testSuiteName}`;
keyGenerator.setPrefix(testKeyPrefix);

// redis client