const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurifier(new JSDOM().window);
const commentSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },

    comment: {
        type: String,
        required: true
    }

})
const voterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,

    },
    name: {
        type: String,
        required: true,

    },
})
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    upvotes: [voterSchema],
    downvotes: [voterSchema],
    comments: [commentSchema]

});

articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }
    next();
});
const Comment = mongoose.model('Comment', commentSchema);
const Article = mongoose.model('Article', articleSchema);
const Voter = mongoose.model('Voter', voterSchema);
module.exports = { Article, Comment, Voter };