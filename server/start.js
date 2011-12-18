#!/usr/bin/env node

var express = require("express")
    app = express.createServer(),
    io = require("socket.io").listen(app);

app.configure(function(){
 var root = __dirname + '/../client/';
 app.use(express.static(root + "static/"));
 app.set('views', root + 'templates/');
});

app.get("/index.html", function(req, res) {
  res.render("index.ejs", { title: "Run a Test", layout: false });
});

app.get("/", function(req, res) {
  res.render("index.ejs", { title: "Run a Test", layout: false });
});

app.get("/testrunner", function(req, res) {
  res.render("testrunner.ejs", { title: "Test Runner", layout: false });
});

var currTestSocket, runner_id = 0;;

io.sockets.on('connection', function (socket) {
  socket.on('request_start_test', function (data) {
    console.log("request_start_test");
    console.log(data);
    socket.broadcast.emit("start_test", data);
    currTestSocket = socket;
  });

  socket.on("test_start", function(data) {
    console.log("test_start");
    var parsed = JSON.parse(data);

    socket.runner_id = runner_id;
    parsed.runner_id = runner_id;
    runner_id++;
    currTestSocket.emit("test_start", parsed);
  });

  socket.on("test_complete", function(data) {
    var parsed = JSON.parse(data);
    parsed.runner_id = socket.runner_id;
    currTestSocket.emit("test_complete", parsed);
  });
});

app.listen(3000, "192.168.1.88");

