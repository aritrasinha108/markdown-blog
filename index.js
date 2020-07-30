const express = require('express');
const app = express();
const articleRouter = require('./routes/article');
const Article = require('./model/article');
const mongoose = require('mongoose');
const methoddOverride = require('method-override');
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
app.use(methoddOverride('_method'));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    let articles = await Article.find().sort({ created: 'desc' });
    res.render('articles/index', { articles: articles });
});
app.use('/articles', articleRouter);
app.listen(80);