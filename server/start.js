#!/usr/bin/env node

const express = require("express")
      MemoryStore = express.session.MemoryStore,
      app = express.createServer(),
      io = require("socket.io").listen(app),
      verify = require("./browserid_client").verify,
      parseCookie = require("connect").utils.parseCookie,
      sessionStore = new MemoryStore(),
      Session = require("connect").middleware.session.Session;

const IP_ADDRESS=process.env['IP_ADDRESS'] || undefined;
const PORT=process.env['PORT'] || 5000;

app.configure(function(){
  var root = __dirname + '/../client/';
  app.use(express.static(root + "static/"));
  app.set('views', root + 'templates/');
  app.use(express.cookieParser());
  app.use(express.session({
    store: sessionStore,
    secret: "TestSwarm Rocks.",
    key: "express.sid" }));
  app.use(express.bodyParser());
});

function render(req, res, template, data) {
  data = data || {};
  if(req.session.email) {
    data.email = req.session.email;
  }
  res.render(template, data);
}

app.get("/index.html", function(req, res) {
  render(req, res, "index.ejs");
});

app.get("/", function(req, res) {
  render(req, res, "index.ejs");
});

app.get("/initiator", function(req, res) {
  render(req, res, "initiator.ejs", { title: "Initiate a Test" });
});

app.get("/test_runner", function(req, res) {
  render(req, res, "test_runner.ejs", { title: "Wait for Tests" });
});

app.post("/wsapi/login", function(req, res) {
  doVerify(req.body, function(err, resp) {
    if(err) {
      res.json({
        success: false
      }, 403);
    }
    else {
      req.session.email = resp.email;
      res.json(resp);
    }
  });
});

app.post("/wsapi/logout", function(req, res) {
  req.session.email = null;
  res.json({ success: true });
});

var runner_id = 0,
    socket_id = 0,
    initiators = {};

io.configure(function() {
  io.set("authorization", function(data, accept) {
    if(data.headers.cookie) {
      data.cookie = parseCookie(data.headers.cookie);
      data.sessionID = data.cookie["express.sid"];
      sessionStore.get(data.sessionID, function(err, session) {
        if(err || !session) {
          accept("Error", false);
        }
        else {
          data.email = session.email;
          data.session = new Session(data, session);
          accept(null, true);
        }
      });
    }
    else {
      return accept("no cookie transmitted.", false);
    }
  });
});

io.sockets.on('connection', function (socket) {
  var hs = socket.handshake;

  socket.set("id", socket_id);
  socket_id++;

  socket.on('login', function(data, fn) {
    doVerify(data, function(err, resp) {
      socket.set("email", email);
      fn(data);
    });
  });

  socket.on('request_start_test', function (data) {
    socket.get("id", function(err, id) {
      // XXX this will have to be torn down.
      initiators[id] = socket;

      socket.get("email", function(err, email) {
        data.initiator_id = id;
        data.email = hs.email;
        socket.broadcast.emit("start_test", data);
      });
    });
  });

  socket.on("test_start", function(data) {
    socket.set("runner_id", runner_id);
    data.email = hs.email || "";
    data.runner_id = runner_id;
    runner_id++;

    var initiator = initiators[data.initiator_id];
    initiator.emit("test_start", data);
  });

  socket.on("test_complete", function(data) {
    socket.get("runner_id", function(err, runner_id) {
      data.email = hs.email || "";
      data.runner_id = runner_id;

      var initiator = initiators[data.initiator_id];
      initiator.emit("test_complete", data);
    });
  });
});

function doVerify(data, fn) {
  verify({
    assertion: data.assertion,
    audience: "http://localhost"  + ":" + PORT
  }, function(err, email) {
    console.log(err);
    if(err) {
      fn(err, null);
    }
    else {
      fn(null, {
        success: true,
        email: email
      });
    }
  });
}

app.listen(PORT, IP_ADDRESS);

