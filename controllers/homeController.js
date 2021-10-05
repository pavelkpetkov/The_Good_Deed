const router = require('express').Router();
const { getUserById }  = require('../services/user');
const { getAllInits } = require('../services/initiative');

router.get('/', (req, res) => {
    res.render('home/home');
})

router.get('/about', (req, res) => {
    res.render('home/about');
})

router.get('/user', async (req, res) => {

    const user = await getUserById(req.user._id);

    const allInits = await getAllInits();

    let numberOfInits = 0;
    let inits = [];
    for (const init of allInits) {
        if(init.author == req.user._id) {
            numberOfInits ++;
            inits.push(init);
        };
    }

    console.log(numberOfInits);
    res.render('user/profile', { user, inits, numberOfInits });
})

module.exports = router;