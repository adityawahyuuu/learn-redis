const redis = require('./mine_redis_client');
const keyGenerator = require('./mine_redis_key_generator');

const remap = siteHash => {
    const remappedSiteHash = {...siteHash};

    remappedSiteHash.id = parseInt(siteHash.id, 10);
    remappedSiteHash.panels = parseInt(siteHash.panels, 10);
    remappedSiteHash.capacity = parseFloat(siteHash.capacity, 10);

    if (siteHash.hasOwnProperty('lat') && siteHash.hasOwnProperty('lng')){
        remappedSiteHash.coordinate = {
            lat: parseFloat(siteHash.lat),
            lng: parseFloat(siteHash.lng)
        };

        delete remappedSiteHash.llat;
        delete remappedSiteHash.lng;
    };

    return remappedSiteHash;
};

const flatten = site => {
    const flattenedSite = {...site};

    if(flattenedSite.hasOwnProperty('coordinate')){
        flattenedSite.lat = flattenedSite.coordinate.lat;
        flattenedSite.lng = flattenedSite.coordinate.lng;
        delete flattenedSite.coordinate;
    };

    return flattenedSite;
};

const insert = async (site) => {
    const client = redis.getClient();

    const siteHashKey = keyGenerator.getSiteHashKey(site.id);

    await client.hmsetAsync(siteHashKey, flatten(site));
    await client.saddAsync(keyGenerator.getSiteIDsKey(), siteHashKey);

    return siteHashKey;
};

const findAll = async () => {
    const client = redis.getClient();
    const sitesId = await client.smembersAsync(keyGenerator.getSiteIDsKey());
    const sites = [];
    for (const siteId of sitesId){
        const siteHash = await client.hgetallAsync(siteId);
        if (siteHash){
            sites.push(remap(siteHash));
        }
    };
    return sites;
};

module.exports = {
    insert,
    findAll
};