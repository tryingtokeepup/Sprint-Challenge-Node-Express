const express = require("express");
const server = express();

// our database helpers for the night - actionModel and projectModel

const actiondb = require("./data/helpers/actionModel");
const projectdb = require("./data/helpers/projectModel");

// const userdb = require("./data/helpers/userDb.js"); // Common JS
// const postdb = require("./data/helpers/postDb.js");

// important middleware
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
// Middleware
// This is what we need to parse our data!
server.use(express.json());
// cors for use with react
server.use(cors());
// morgan for logging - short for less info?
server.use(morgan("short"));
// helemt for security! kind of cool
server.use(helmet());

server.listen(5005, () =>
  console.log(
    "server on port 5005 - seems to error out if this line of code is in index.js. Fixed by bypassing index.js, and going straight into server.js"
  )
);
// quick server check
server.get("/", (req, res) => {
  res.send(`sanity check! weirdly enough, my index.js is giving me pain.`);
});

/////========= Project Endpoints ==============//////

// first, lets get all those projects
server.get("/projects", (req, res) => {
  actiondb
    .get()
    .then(projects => {
      res.status(200).send(projects); //send the AOK
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
