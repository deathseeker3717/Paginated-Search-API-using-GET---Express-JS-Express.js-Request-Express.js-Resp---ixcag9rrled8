const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');

// Load articles from db.json
const dbPath = path.join(__dirname, 'db.json');
const allArticles = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

app.get('/search', (req, res) => {
    const name = req.query.name;
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;

    // Check if name is missing or empty
    if (!name || name.trim() === '') {
        return res.status(400).json({
            error: "Search name parameter is required."
        });
    }

    // Search articles by title (case-insensitive)
    const filteredArticles = allArticles.filter(article =>
        article.title.toLowerCase().includes(name.toLowerCase())
    );

    // Total matching articles
    const totalResults = filteredArticles.length;

    // Total number of pages
    const totalPages = Math.ceil(totalResults / limit);

    // Calculate which results to return
    const startIndex = (page - 1) * limit;
    const articles = filteredArticles.slice(
        startIndex,
        startIndex + limit
    );

    // Send response
    res.status(200).json({
        currentPage: page,
        totalPages: totalPages,
        totalResults: totalResults,
        articles: articles
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = { app };
