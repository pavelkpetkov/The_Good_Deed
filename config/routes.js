const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const dataController = require('../controllers/dataController');


module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/data', dataController);
}