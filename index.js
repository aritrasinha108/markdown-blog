const express = require('express');
const app = express();
const articleRouter = require('./routes/article');
const Article = require('./model/article');
const mongoose = require('mongoose');
const methoddOverride = require('method-override');
const authRouter = require('./routes/auth');
const db = require('./config/key').mongoURI;
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const ensureAthenticated = require('./config/authenticate').ensureAuthenticated;


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("MongoDb connected...");
    })
    .catch(err => { throw err; });

app.set('view engine', 'ejs');
app.use(methoddOverride('_method'));

app.use(express.static(__dirname + '/public/'));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

app.use('/users', authRouter);
app.use('/articles', ensureAthenticated);
app.use('/articles', articleRouter);
app.get('/', async (req, res) => {
    let articles = await Article.find().sort({ created: 'desc' });
    res.render('authentication/home', { articles: articles });
});


app.listen(80);