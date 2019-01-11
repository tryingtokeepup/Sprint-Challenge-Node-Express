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
  projectdb
    .get()
    .then(projects => {
      res.status(200).send(projects); //send the AOK
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// for my next trick, lets get a SPECIFIC endpoint

server.get("/projects/:id", (req, res) => {
  // first, what is an id? lets define it
  const id = req.params.id;
  //now, let's use the id to find that project
  projectdb
    .get(id)
    .then(project => {
      // if it exists, send the a'OK and the project!
      res.status(200).send(project);
    })
    .catch(err => {
      // but if that id doesn't have a project on it, send that error and a 500 code!
      res.status(500).send(err);
    });
});

// now, lets add a project using the post method!

server.post("/projects", (req, res) => {
  // lets try a little deconstruction
  const { name, description, completed } = req.body;

  if (!name || !description) {
    res.status(404).json({
      message:
        "Hey man, remember to put in a name AND a description. Completed boolean is optional, but hey, put it in why doncha?"
    });
  } else {
    projectdb
      .insert({
        name,
        description,
        completed
      })
      .then(project => {
        res.status(200).send(project);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  }
});

// delete a project
server.delete("/projects/:id", (req, res) => {
  // first, what is an id? lets define it
  const id = req.params.id;

  projectdb
    .get(id)
    .then(project => {
      // first, check if the project exists
      if (project) {
        projectdb.remove(id).then(countOfDeleted => {
          res
            .status(200)
            .json({ countOfDeleted, message: "Great job, its removed!" });
        });
      } else {
        res.status(404).json({
          message:
            "Yo, check yoself befo' u wrek urself - That project doesn't exist."
        });
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Not sure m8, but something went wrong. Try again?" });
    });
});

// finally, lets get the ability to modify a project!
server.put("/projects/:id", (req, res) => {
  // we need an id, of course
  const { id } = req.params;
  // make sure they have a name, description, and possibly a completed obj
  const { name, description, completed } = req.body;

  if (!name || !description) {
    res.status(404).json({
      message:
        "Hey man, remember to put in a name AND a description. Completed boolean is optional, but hey, put it in why doncha?"
    });
  } else {
    projectdb.get(id).then(project => {
      if (project) {
        projectdb
          .update(id, req.body)
          .then(response =>
            res
              .status(200)
              .json({ response, message: "yo, i think we good son!" })
          )
          .catch(err => res.status(500).json(err));
      } else {
        res.status(404).json({
          message:
            "The project with the specified ID does not exist. Try again?"
        });
      }
    });
  }
});
