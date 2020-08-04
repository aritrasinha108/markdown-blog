const express = require('express');
const router = express.Router();
const Users = require('../model/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
router.get('/login', (req, res) => {
    res.render('authentication/login');
})

router.get('/register', (req, res) => {
    res.render('authentication/register');
})
router.post('/register', (req, res) => {
    // console.log(req.body);
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please fill all the fields" });
    }

    //Validity for the name
    var regex = /^[a-zA-Z" "]{2,30}$/;

    if (!regex.test(name)) {
        errors.push({ message: "No.s are not allowed in the name" });

    }


    // Validity for the email
    at = email.indexOf("@");
    dot = email.lastIndexOf(".");
    if ((at < 1) || (dot < 1) || ((dot - at) < 2)) {
        errors.push({ message: "Please Enter a valid email Id" });
    }
    // Validate password

    if (password != password2) {
        errors.push({ message: "Passwords do not match" });

    }
    if (password.length < 6) {
        errors.push({ message: "The password length should be less than 6" })
    }
    if (errors.length > 0) {
        res.render('authentication/register', {
            errors,
            name,
            email,
            password,
            password2
        });

    }
    else {
        Users.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ message: "User already registered.." });
                    res.render('authentication/register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    const newUser = new Users({
                        name,
                        email,
                        password,
                    });

                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', "You are registered successfully, login to continue");
                                res.redirect('/users/login');

                            })
                            .catch(err => console.log(err))
                    }));
                }
            })


    }
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/articles',
        failureRedirect: '/users/login',
        failureFlash: true,

    })(req, res, next);

});
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', "You are logged out");
    res.redirect('/users/login');
});

module.exports = router;