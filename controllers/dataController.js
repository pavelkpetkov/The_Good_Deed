const router = require('express').Router();
const { isGuest, isUser } = require('../middlewares/guards');
const { getUserById } = require('../services/user');


router.get('/', (req, res) => {
    res.render('home/categories');
})

router.get('/environment', async (req, res) => {
    const allEnvironment = await req.storage.getAllEnvironmentInits();
    res.render('initiative/allEnvironment', { allEnvironment });
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
        author: req.user._id,
    }

    try {
        await req.storage.createInit(initData);
        // TODO: redirect to correct category:
        if (initData.category == 'Environment') {
            res.redirect('/data/environment');
        } else if (initData.category == 'Society') {
            res.redirect('/data/society');
        } else {
            res.redirect('/data/beinspired');
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
                author: req.user._id,
            }
        }
        res.render('initiative/create', ctx);
    }
});

router.get('/details/:id', isUser(), async (req, res) => {
    try {
        const initiative = await req.storage.getInitById(req.params.id);

        initiative.hasUser = Boolean(req.user);
        if (req.user) {
            initiative.isOwner = req.user && req.user._id == initiative.author;
            initiative.hasJoined = false;
            if (initiative.joined.length > 0) {
                let people = [];
                for (const userId of initiative.joined) {
                    if (userId == req.user._id) {
                        initiative.hasJoined = true;
                    }
                    let user = await getUserById(userId);
                    people.push(user.name);
                }
                initiative.peopleJoined = people.join(', ');
            }

            const creator = await getUserById(initiative.author);
            initiative.authorName = creator.name;
            console.log(initiative);
        }

        res.render('initiative/details', { initiative });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const init = await req.storage.getInitById(req.params.id);
        if (init.author != req.user._id) {
            throw new Error('Cannot delete initiative you haven\'t created');
        }

        await req.storage.deleteInit(req.params.id);

        res.redirect('/data');
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const init = await req.storage.getInitById(req.params.id);

        if (init.author != req.user._id) {
            throw new Error('Cannot edit initiative you haven\'t created');
        }

        res.render('initiative/edit', { init });
    } catch (err) {
        console.log(err.message);
        res.redirect('/data/details/' + req.params.id);
    }
})

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const init = await req.storage.getInitById(req.params.id);

        if (init.author != req.user._id) {
            throw new Error('Cannot edit initiative you haven\'t created');
        }

        await req.storage.editInit(req.params.id, req.body);

        res.redirect('/data/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/data/details/' + req.params.id);
    }
})


module.exports = router;
