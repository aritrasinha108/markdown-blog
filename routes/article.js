const express = require('express');
const router = express.Router();
const { Article, Comment, Voter } = require('../model/article');
const Users = require('../model/User');
const passport = require('passport');


router.get('/', async (req, res) => {
    console.log("Welcome...");
    console.log(req.user);
    let articles = await Article.find().sort({ created: 'desc' });
    res.render('articles/index', { articles: articles, user: req.user });
});
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});
router.get('/myArticles', async (req, res) => {

    let myArticles = await Article.find({ authorEmail: req.user.email }).sort({ created: 'desc' });


    console.log(myArticles);
    res.render('articles/myArticles', { articles: myArticles, user: req.user });


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
    let index = author.articles.findIndex(article => article != req.params.title);
    author.articles.splice(index, 1);
    await author.save();
    res.redirect('/articles');
});
router.post('/:id&:comment', async (req, res) => {

    let article = await Article.findById(req.params.id);
    try {
        console.log(article);
        let writer = req.user;
        let comment = new Comment({
            name: req.user.name,
            comment: req.params.comment,
            email: req.user.email
        });
        article.comments.push(comment);
        article = await article.save();
        res.json({
            status: "success",
            username: comment.name,
            comment: comment.comment
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            status: "failure",

            message: "Comment was not posted"
        });
    }

});
router.post('/toggleUpvote/:title', async (req, res) => {
    const title = req.params.title;
    console.log("title is: " + title);
    const article = await Article.findOne({ title: title });
    console.log("article is: " + article);

    if (article == null) {
        console.log('null');
        res.json({
            status: "error",
            status: "error",
            message: "Post dows not exist"
        });
    }
    else {

        let upvoters = article.upvotes;
        console.log("upvoters are" + upvoters)
        let index = upvoters.findIndex(upvoter => upvoter.email == req.user.email);
        console.log(index + " is the index ");
        if (index == -1) {

            let voter = new Voter({
                email: req.user.email,
                name: req.user.name
            });
            article.upvotes.push(voter);

            await article.save();
            console.log(article.upvotes);
            res.json({
                status: 'like',
                message: "Blog has been liked"
            });
        }
        else {

            article.upvotes.splice(upvoter => upvoter.email == req.user.email);

            await article.save();
            console.log(article.upvotes);
            res.json({
                status: 'unlike',
                message: "Blog has been unliked"
            });
        }
    }


});
router.post('/toggleDownvote/:title', async (req, res) => {
    const title = req.params.title;
    console.log("title is: " + title);

    const article = await Article.findOne({ title: title });
    console.log("article is: " + article);

    if (article == null) {
        console.log("null");
        res.json({
            status: "error",
            status: "error",
            message: "Post dows not exist"
        });
    }
    else {

        let downvoters = article.downvotes;
        console.log("Downvoters " + downvoters);
        let index = downvoters.findIndex(downvoter => downvoter.email == req.user.email);
        console.log(index);
        if (index == -1) {

            let voter = new Voter({
                email: req.user.email,
                name: req.user.name
            });
            article.downvotes.push(voter);

            await article.save();
            console.log(article.downvotes);
            res.json({
                status: 'dislike',
                message: "Blog has been disliked"
            });
        }
        else {
            article.downvotes.splice(downvoter => downvoter.email == req.user.email);
            await article.save();
            console.log(article.downvotes);
            res.json({
                status: 'undo',
                message: "Blog has been unliked"
            });
        }
    }


})


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
                author.articles.splice(index, 1);


            }

            author.articles.push(article.title);

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