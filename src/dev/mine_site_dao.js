const redisSiteDAO = require('../daos/mine_site_dao_redis_impl');

const coba = async () => {
    const sites = [{
        id: 1,
        capacity: 4.5,
        panels: 3,
        address: '123 Willow St.',
        city: 'Oakland',
        state: 'CA',
        postalCode: '94577',
        coordinate: {
          lat: 37.739659,
          lng: -122.255689,
        },
      }, {
        id: 2,
        capacity: 3.0,
        panels: 2,
        address: '456 Maple St.',
        city: 'Oakland',
        state: 'CA',
        postalCode: '94577',
        coordinate: {
          lat: 37.739559,
          lng: -122.256689,
        },
      }, {
        id: 3,
        capacity: 4.0,
        panels: 3,
        address: '789 Oak St.',
        city: 'Oakland',
        state: 'CA',
        postalCode: '94577',
        coordinate: {
          lat: 37.739659,
          lng: -122.255689,
        },
    }];
    
    for (const site of sites) {
        await redisSiteDAO.insert(site);
    };
    
    const sitesFromRedis = await redisSiteDAO.findAll();
    console.log(sitesFromRedis);
};

// coba();