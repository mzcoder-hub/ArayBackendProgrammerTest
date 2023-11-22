// db.js
const mongoose = require("mongoose");
const dbUrl =
  "mongodb+srv://galangypradana:vaxIa4fq503tpr8j@araybackendtest.dvim5e1.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

module.exports = db;
