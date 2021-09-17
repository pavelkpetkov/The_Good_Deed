const router = require('express').Router();
const { isGuest, isUser } = require('../middlewares/guards');


router.get('/', (req, res) => {
    res.render('home/categories');
})

router.get('/environment', async (req, res) => {
    const allEnvoronment = await req.storage.getAllEnvironmentInits();
    res.render('initiative/allEnvironment', { allEnvoronment });
})

router.get('/society', async (req, res) => {
    const allSociety = await req.storage.getAllSocietyInits();
    res.render('initiative/allSociety', { allSociety });
})

router.get('/beinspired', async (req, res) => {
    const allBeInspired = await req.storage.getAllBeInspiredInits();
    res.render('initiative/allBeInspired', { allBeInspired });
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
        if (initData.category == 'Environment') {
            res.redirect('/environment');
        } else if (initData.category == 'Society') {
            res.redirect('/society');
        } else {
            res.redirect('/beinspired');
        }
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
