var passport = require('passport');

exports.callback = function (email, password, done) { 
    console.log('email');
    console.log(email);
    console.log('password');
    console.log(password);

    try {
        email = email.toLowerCase()
    } catch (err) {
        console.log('local.js :)')
        console.log(err)
    }



    exports.Administrator.findOne({
        where: {
            email: email
        }}, function (err, administrator) {
            
            if (err) {
                return done(err);
            }
            if (!administrator) {
                return done(err, false);
            }
            console.log('a')             
            var len = exports.Administrator.verifyPassword.length;
            console.log('b')             
            if (len === 2) {
                console.log('c')             
                if (!exports.Administrator.verifyPassword(password, administrator.password)) {
                   console.log('d')             
                   return done(err, false);
                } else {
                   console.log('e')             
                   return done(err, administrator);
                }
            } else if (len === 3) {
                console.log('f')
                exports.Administrator.verifyPassword(password, administrator.password, function(err, isMatch) {
                   console.log('h')
                   return done(err, !err && isMatch ? administrator : false);
                });
            } else {
                return done(err, false);
            }
    });
};

exports.init = function (conf, app) {

    var Strategy = require('passport-local').Strategy;
    passport.use(new Strategy({
        usernameField: conf.usernameField || 'email'
    }, exports.callback));

    // app.post('/login', passport.authenticate('local', {
    //     failureRedirect: '/login',
    //     // failureFlash: "sdfsdfsdf", //conf.failureFlash,
    //     successRedirect: '/administrators/idk'
    // }));

    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password.',
        // failureFlash: conf.failureFlash
    }), exports.redirectOnSuccess);
};
