const router = require('express').Router();
const { isGuest, isUser } = require('../middlewares/guards');
const { getUserById } = require('../services/user');


router.get('/', (req, res) => {
    res.render('home/categories');
})

router.get('/environment', async (req, res) => {
    const allEnvironmentInits = await req.storage.getAllEnvironmentInits();

    //check if they are past:
    let currentDate = new Date();
    const allEnvironment = [];

    for (const init of allEnvironmentInits) {
        let initDate = new Date(init.date);
        let isItPast = initDate.getTime() < currentDate.getTime();
        if (!isItPast) {
            allEnvironment.push(init);
        }
    }

    res.render('initiative/allEnvironment', { allEnvironment });
})

router.get('/society', async (req, res) => {
    const allSocietyInits = await req.storage.getAllSocietyInits();

    //check if they are past:
    let currentDate = new Date();
    const allSociety = [];

    for (const init of allSocietyInits) {
        let initDate = new Date(init.date);
        let isItPast = initDate.getTime() < currentDate.getTime();
        if (!isItPast) {
            allSociety.push(init);
        }
    }

    res.render('initiative/allSociety', { allSociety });
})

router.get('/beinspired', async (req, res) => {
    const allInits = await req.storage.getAllInits();

    let currentDate = new Date();
    const allBeInspired = [];

    for (const init of allInits) {
        let initDate = new Date(init.date);
        let isItPast = initDate.getTime() < currentDate.getTime();
        if (isItPast) {
            allBeInspired.push(init);
        }
    }

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
        img: req.body.img,
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
                img: req.body.img,
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

            for (const userId of initiative.usersLiked) {
                if (userId == req.user._id) {
                    initiative.hasLiked = true;
                }
            }
            console.log(initiative);
        }

        res.render('initiative/details', { initiative });
        console.log(initiative);
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
});

router.get('/join/:id', isUser(), async (req, res) => {
    try {
        const init = await req.storage.getInitById(req.params.id);
        if (init.author == req.user._id) {
            throw new Error('Cannot join your own initiative!');
        }

        await req.storage.joinInit(req.params.id, req.user._id);
        res.redirect('/data/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/data/details/' + req.params.id);
    }
});

router.get('/like/:id', isUser(), async (req, res) => {
    try {
        const init = await req.storage.getInitById(req.params.id);
        if (init.author == req.user._id) {
            throw new Error('Cannot like your own initiative!');
        }

        await req.storage.likeInit(req.params.id, req.user._id);
        res.redirect('/data/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/data/details/' + req.params.id);
    }
});


module.exports = router;
