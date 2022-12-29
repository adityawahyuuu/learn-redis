const redis = require('redis');
const bluebird = require('bluebird');
const config = require('better-config');

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis);

// Create a client and connect to Redis using configuration
// from config.json.
const clientConfig = {
    host: config.get('dataStores.redis.host'),
    port: config.get('dataStores.redis.port')
};

if(config.get('dataStores.redis.password')){
    clientConfig.password= config.get('dataStores.redis.password');
};

const client = redis.createClient(clientConfig);

// This is a catch all basic error handler.
client.on('error', error => console.log(error));

module.exports = {
    getClient: () => client
};