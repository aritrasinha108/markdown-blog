const localStatergy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Users = require('../model/User');

module.exports = function (passport) {
    passport.use(
        new localStatergy({ usernameField: 'email' }, (email, password, done) => {
            Users.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "User doesn't exist" });
                    }
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) return done(null, user);
                        else {
                            return done(null, false, { message: 'Password is incorrect' });
                        }
                    })
                })
                .catch(err => {
                    throw err;
                })

        })
    )
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Users.findById(id, function (err, user) {
            done(err, user);
        });
    });

}