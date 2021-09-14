const router = require('express').Router();
const { isGuest } = require('../middlewares/guards');


router.get('/', (req, res) => {
    res.render('home/categories');
})

router.get('/environment', (req, res) => {
    res.send('Hi');
})

module.exports = router;
