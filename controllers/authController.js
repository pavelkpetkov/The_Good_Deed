const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
})

router.post(
    '/register',
    isGuest(),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 symbols'),
    body('email', 'Invalid email').isEmail().matches(/.*@.*/).withMessage('Invalid email'),
    body('rePass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords don\'t match');
        }
        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            if (errors.length > 0) {
                throw new Error(Object.values(errors).map(e => e.msg).join('\n '));
            }
            await req.auth.register(req.body.name, req.body.email, req.body.password);
            res.redirect('/');
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: [err.message],
                userData: {
                    name: req.body.name,
                    email: req.body.email
                }
            }
            res.render('user/register', ctx);
        }
    }
);

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
})
router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body.email, req.body.password);
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        const ctx = {
            errors: [err.message],
            userData: {
                email: req.body.email
            }
        }
        res.render('user/login', ctx);
    }
})

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
})

module.exports = router;
