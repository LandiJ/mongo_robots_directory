const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const path = require("path");
const mustacheExpress = require("mustache-express");

const app = express();
const port = process.env.PORT || 8000;
const dbUrl = "mongodb://localhost:27017/robots";

app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

app.use(express.static(__dirname + "/public"));

let DB;
let ROBOTSUSERS;

// connect to db
mongoClient.connect(dbUrl, function(err, db) {
  if (err) {
    console.warn("Error connecting to database", err);
  }

  DB = db;
  ROBOTSUSERS = db.collection("users");
});

app.get("/robotsusers", (req, res) => {
  ROBOTSUSERS.find({}).toArray(function(err, foundUsers) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("index", { users: foundUsers });
  });
});

app.get("/robotsusers/:id", (req, res) => {
  ROBOTSUSERS.findOne({ _id: ObjectId(req.params.id) }).then(function(
    err,
    foundUser
  ) {
    if (err) {
      res.status(500).send(err);
    }

    res.send(foundUser);
  });
});

// Employed and Unemployed Routes
app.get("/employed", function(req, res) {
  ROBOTSUSERS.find({ job: { $nin: [null] } }).toArray(function(
    err,
    foundUsers
  ) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("index", { users: foundUsers });
  });
});

app.get("/hire", function(req, res) {
  ROBOTSUSERS.find({ job: null }).toArray(function(err, foundUsers) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("index", { users: foundUsers });
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}!`);
});
