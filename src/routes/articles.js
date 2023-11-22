// articles.js
const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const {
  getFromCache,
  addToCache,
  deleteCache,
} = require("../middleware/cache");

// [POST] /articles - Publish a new article.
router.post("/articles", async (req, res) => {
  try {
    const newArticle = await Article.create(req.body);
    addToCache(newArticle._id, newArticle);
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// [GET] /articles - View the list of articles, sorted by the newest, with search functionality and author filtering.
router.get("/articles", async (req, res) => {
  try {
    // Check cache first
    const cachedArticles = getFromCache("articles");

    if (cachedArticles) {
      return res.json(cachedArticles);
    }

    const articles = await Article.find().sort({ created: -1 }).exec();
    addToCache("articles", articles);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// [GET] /articles/:id - Access a specific article by ID.
router.get("/articles/:id", async (req, res) => {
  try {
    const articleId = req.params.id;

    // Check cache first
    const cachedArticle = getFromCache(articleId);
    if (cachedArticle) {
      return res.json(cachedArticle);
    }

    const article = await Article.findById(articleId).exec();

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    addToCache(articleId, article);
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// [PUT] /articles/:id - Update a specific article.
router.put("/articles/:id", async (req, res) => {
  try {
    const articleId = req.params.id;
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      req.body,
      { new: true }
    ).exec();

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Get all articles for update cache
    const articles = await Article.find().sort({ created: -1 }).exec();

    // Update cache
    addToCache(articleId, updatedArticle);
    addToCache("articles", articles);

    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// [DELETE] /articles/:id - Delete a specific article.
router.delete("/articles/:id", async (req, res) => {
  try {
    const articleId = req.params.id;

    const deletedArticle = await Article.findByIdAndDelete(articleId).exec();

    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Remove from cache
    deleteCache(articleId);

    res.json(deletedArticle);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
