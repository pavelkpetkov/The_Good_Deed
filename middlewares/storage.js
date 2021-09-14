//const trip = require('../services/trip');

module.exports = () => (req, res, next) => {
    //TODO import and decorate services
    req.storage = {
        //...trip
    };

    next();
}