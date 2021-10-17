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

router.post('/search', async (req, res) => {
    try {
        console.log(req.body.search);
        const initsSearched = await req.storage.getSearched(req.body.search);
        res.render('home/searchedTemp', { initsSearched });
        // res.redirect('/course/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/home/404');
    }
})

module.exports = router;