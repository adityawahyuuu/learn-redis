const redis = require('./mine_redis_client');
const keyGenerator = require('./mine_redis_key_generator');
const timeUtils = require('../utils/mine_time_utils');

const maxMetricRetentionDays = 30;
const metricExpirationSeconds = 60 * 60 * 24 * maxMetricRetentionDays + 1;
const metricIntervalSeconds = 60;
const metricsPerDay = metricIntervalSeconds * 24;
const maxDaysToReturn = 7;
const daySeconds = 24 * 60 * 60;

const formatMeasurementMinute = (measurement, minuteOfDay) => `${Math.round(measurement)}:${minuteOfDay}`;

const insertMetric = async (siteId, metricValue, metricName, timestamp) => {
    const client = redis.getClient();

    const metricKey = keyGenerator.getDayMetricKey(siteId, metricName, timestamp);
    const minuteOfDay = timeUtils.getMinuteOfDay(timestamp);

    await client.zaddAsync(metricKey, minuteOfDay, formatMeasurementMinute(metricValue, minuteOfDay));
    await client.expireAsync(metricKey, metricExpirationSeconds);
};

const insert = async (meterReading) => {
    await Promise.all([
        insertMetric(meterReading.siteId, meterReading.whGenerated, 'whGenerated', meterReading.dateTime),
        insertMetric(meterReading.siteId, meterReading.whUsed, 'whUsed', meterReading.dateTime),
        insertMetric(meterReading.siteId, meterReading.tempC, 'tempC', meterReading.dateTime)
    ]);
};

const extractMeasurementMinute = measurementMinute => {
    const arr = measurementMinute.split(':');
    return {
        value: parseFloat(arr[0]),
        minute: parseInt(arr[1], 10),
    };
};

const getMeasurementsForDate = async (siteId, metricUnit, timestamp, limit) => {
    const client = redis.getClient();

    const key = keyGenerator.getDayMetricKey(siteId, metricUnit, timestamp);
    const metrics = await client.zrevrangeAsync(key, 0, limit - 1);

    const formattedMeasurements = [];
    for (let n=0; n<metrics.length; n+=1){
        const {value, minute} = extractMeasurementMinute(metrics[n]);
        const measurement = {
            siteId,
            dateTime: timeUtils.getTimestampForMinuteOfDay(timestamp, minute),
            value,
            metricUnit
        };
        formattedMeasurements.unshift(measurement);
    };

    return formattedMeasurements;
};

const getRecent = async (siteId, metricUnit, timestamp, limit) => {
    if (limit > (metricsPerDay * maxMetricRetentionDays)){
        const err = new Error(`Cannot request more than ${maxMetricRetentionDays} days of minute level data.`);
        err.name = 'TooManyMetricsError';

        throw err;
    };

    let currentTimestamp = timestamp;
    let count = limit;
    let iterations = 0;
    const measurements = [];

    do{
        const dateMeasurements = await getMeasurementsForDate(
            siteId,
            metricUnit,
            currentTimestamp,
            count
        );
        measurements.unshift(...dateMeasurements);
        count -= dateMeasurements.length;
        iterations += 1;
        currentTimestamp -= daySeconds;
    } while(count > 0 && iterations < maxDaysToReturn);

    return measurements;
}

module.exports = {
    insert,
    getRecent
}