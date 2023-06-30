// The index.js file of your application
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const mysql = require("mysql2");
const port = 8089;
app.use(bodyParser.urlencoded({ extended: true }));
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Zatsatheman123",
  database: "homebuddy"
});
// connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;
app.use(express.static(path.join(__dirname, 'public')));
require("./routes/main")(app);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
