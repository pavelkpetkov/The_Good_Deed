const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home/home');
})

router.get('/about', (req, res) => {
    res.render('home/about');
})

module.exports = router;