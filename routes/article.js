const express = require('express');
const router = express.Router();
const Article = require('../model/article');
const Users = require('../model/User');
const passport = require('passport');

router.get('/', async (req, res) => {
    console.log("Welcome...");
    console.log(req.user);
    let articles = await Article.find().sort({ created: 'desc' });
    res.render('articles/index', { articles: articles });
});
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});
router.get('/myArticles', async (req, res) => {

    let myArticles = await Article.find({ authorEmail: req.user.email }).sort({ created: 'desc' });


    console.log(myArticles);
    res.render('articles/myArticles', { articles: myArticles });


})


router.post('/', async (req, res, next) => {

    req.article = new Article();
    next();

}, saveArticleAndRedirect('new'));


router.put('/:id', async (req, res, next) => {

    req.article = await Article.findById(req.params.id);
    req.oldTitle = req.article.title;
    next();

}, saveArticleAndRedirect('edit'));


router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null)
        res.redirect('/articles');
    let id = article._id;
    // console.log(id + " is the type of id that is present");
    res.render('articles/show', { article: article });

});

router.get('/edit/:id', async (req, res) => {
    let article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
});

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    let author = await Users.findOne({ email: req.user.email });
    author.articles = author.articles.filter(article => article != req.params.title);
    await author.save();
    res.redirect('/articles');
});


function saveArticleAndRedirect(path) {
    return async (req, res) => {

        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        if (path == 'new') {
            article.author = req.user.name;
            article.authorEmail = req.user.email;

        }

        try {
            article = await article.save();
            let author = await Users.findOne({ email: req.user.email });
            if (path == 'edit') {

                let index = author.articles.findIndex(entry => entry.title == req.oldTitle);
                author.articles[index] = article.title;

            }
            else {
                author.articles.push(article.title);
            }
            await author.save();
            console.log("is the author");

            res.redirect(`/articles/${article.slug}`);

        } catch (e) {
            res.render(`articles/${path}`, { article: article });
            console.log(e);
        }
    }
}


module.exports = router;