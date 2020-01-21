const express = require("express");
const http = require("http");
const fs = require("fs-extra");
const path = require("path");
var bodyParser = require("body-parser");
const uuid = require("uuid/v4");

const app = express();

const DATA_FILE_NAME = "data.json";

const DATA_PATH = path.join(__dirname, DATA_FILE_NAME);

app.use(bodyParser.json());

const getTODOS = () => fs.readFile(DATA_PATH, "utf-8").then(JSON.parse);

app.get("/todos", (req, res) => {
  getTODOS
    .then(todos => res.send(todos))
    .catch(e => {
      res.status(500).send("<b>Internal Server Error<b>");
    });
});

app.post("/todo", (req, res) => {
  getTODOS()
    .then(todos => {
      req.body.id = uuid();
      todos.push(req.body);
      return fs
        .writeFile(DATA_PATH, JSON.stringify(todos))
        .then(() => res.send(req.body));
    })
    .catch(e => res.status(500).send("<b>Internal Server Error<b>"));
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("I am listening at ::: ", 3000);
});
