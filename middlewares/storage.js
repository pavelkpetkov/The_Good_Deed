const initiative = require('../services/initiative');

module.exports = () => (req, res, next) => {
    req.storage = {
        ...initiative
    };
    next();
}