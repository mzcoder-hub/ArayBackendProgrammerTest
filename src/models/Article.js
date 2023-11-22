// Article.js
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  author: String,
  title: String,
  body: String,
  created: { type: Date, default: Date.now },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
