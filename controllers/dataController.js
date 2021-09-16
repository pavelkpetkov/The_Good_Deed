const router = require('express').Router();
const { isGuest, isUser } = require('../middlewares/guards');


router.get('/', (req, res) => {
    res.render('home/categories');
})

router.get('/environment', (req, res) => {
    //TO DO
    res.send('Hi');
})

router.get('/society', (req, res) => {
    //TO DO
    res.send('Hi');
})

router.get('/beinspired', (req, res) => {
    //TO DO
    res.send('Hi');
})

router.get('/create', isUser(), (req, res) => {
    res.render('initiative/create');
})

router.post('/create', isUser(), async (req, res) => {
    const initData = {
        category: req.body.category,
        title: req.body.title,
        location: req.body.location,
        image: req.body.image,
        date: req.body.date,
        time: req.body.time,
        description: req.body.description,
        owner: req.user._id,
    }

    try {
        await req.storage.createInit(initData);
        // TODO: redirect to correct category:
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        const ctx = {
            errors: parseError(err),
            initData: {
                category: req.body.category,
                title: req.body.title,
                location: req.body.location,
                image: req.body.image,
                date: req.body.date,
                time: req.body.time,
                description: req.body.description,
                owner: req.user._id,
            }
        }
        res.render('initiative/create', ctx);
    }
})

module.exports = router;
