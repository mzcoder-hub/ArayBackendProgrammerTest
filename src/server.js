// server.js
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db");
const articlesRouter = require("./routes/articles");

const app = express();
const PORT = process.env.PORT || 8888;

app.use(bodyParser.json());

// Ensure database connection before starting the server
db.once("open", () => {
  console.log("Connected to the database!");
});

app.use("/", articlesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
