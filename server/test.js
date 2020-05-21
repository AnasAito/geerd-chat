const express = require("express");
const request = require("request");
const cors = require("cors");
var bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = mongodb+srv://geerd:${process.env.DB_PASSWORD}@scrapingcluster-pjvhx.gcp.mongodb.net/test?retryWrites=true&w=majority;

// Database Name
const dbName = "jobs";

// Create a new MongoClient
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const findDocuments = function(db, search, callback) {
  // Get the documents collection
  const collection = db.collection(search);
  // Find some documents
  collection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
};

app.post("/jobs", (req, res) => {
  console.log(req.body);
  const search = req.body.search.split(" ").join("_");
  try {
    const db = client.db(dbName);
    findDocuments(db, search, function(docs) {
      res.send(docs);
      client.close();
    });
  } catch (e) {
    return res.json({
      errors: [{ message: e }]
    });
  }

  //   const job_settings = JSON.stringify({ COLLECTION_NAME: collection_name });
});

// const scraping_api = () => {
//   client.connect(function(err) {
//     assert.equal(null, err);
//     console.log("Connected correctly to server");
//   });
// };
app.listen(8020, () => console.log("Example app listening on port 8080"));

// scraping_api();

module.exports = {
  app
};