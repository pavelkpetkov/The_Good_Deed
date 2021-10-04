// const exphbs = require('express-handlebars');
const hbs = require('express-handlebars');
const express = require('express');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middlewares/auth');
const storageMiddleware = require('../middlewares/storage');

module.exports = (app) => {

    app.engine('hbs', hbs({
        extname: 'hbs',
                helpers: {
            likes: function(value, options) {
                if (value == 1) {
                    return "<span class='likes'>" + options.fn( {amount: value} ) + "Like" + "</span>";
                } else {
                    return "<span class='likes'>" +  options.fn( {amount: value} ) + "Likes" + "</span>";
                }
            }
        }
    }));

    // const hbs = exphbs.create({
    //     helpers: {
    //         likes: function(value) {
    //             if (value == 1) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         }
    //     }
    // })
    // app.engine('hbs', hbs.create);

    app.set('view engine', 'hbs');
    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(authMiddleware());
    app.use(storageMiddleware());

    app.use((req, res, next) => {
        if (!req.url.includes('favicon')) {
            console.log('>>>', req.method, req.url);
            if (req.user) {
                console.log('Known user', req.user.name);
            }
        }
        next();
    })
}