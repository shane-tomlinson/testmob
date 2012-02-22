/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const socket = require("socket.io"),
      Session = require("connect").middleware.session.Session,
      parseCookie = require("connect").utils.parseCookie;

var io,
    families,
    db;

exports.init = function(config) {
  var app = config.app;
  if(!app) {
    throw "missing config option: app";
  }

  io = socket.listen(app);
  io.configure(function() {
    // required for Heroku.
    // http://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);

    io.set("authorization", socket_authorization);
  });

  families = {};
  db = config.db;
};

exports.start_family = function(family_name) {
  if(!families[family_name]) {
    io.of("/" + family_name).on('connection', socket_connection);
    families[family_name] = true;
  }
};

var runner_id = 0,
    socket_id = 0,
    initiators = {};

function socket_authorization(data, accept) {
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
}

function socket_connection(socket) {
  var hs = socket.handshake;

  socket.set("id", socket_id);
  socket_id++;

  socket.on('login', function(data, fn) {
    verifier.verify(data, function(err, resp) {
      socket.set("email", email);
      fn(data);
    });
  });

  socket.on('request_start_suite', function (data) {
    socket.get("id", function(err, id) {
      db.get("tests_started", function(err, value) {
        if(err) return;

        var tests_started = ~~value;
        tests_started++;
        db.set("tests_started", tests_started);

        // XXX this will have to be torn down.
        initiators[id] = socket;

        socket.get("email", function(err, email) {
          data.initiator_id = id;
          data.email = hs.email;
          socket.broadcast.emit("start_suite", data);
        });
      });
    });
  });

  socket.on("suite_start", function(data) {
    socket.set("runner_id", runner_id);
    data.email = hs.email || "";
    data.runner_id = runner_id;
    runner_id++;

    var initiator = initiators[data.initiator_id];
    initiator.emit("suite_start", data);
  });

  socket.on("test_done", function(data) {
    socket.get("runner_id", function(err, runner_id) {
      data.email = hs.email || "";
      data.runner_id = runner_id;

      var initiator = initiators[data.initiator_id];
      initiator.emit("test_done", data);
    });
  });

  socket.on("suite_complete", function(data) {
    socket.get("runner_id", function(err, runner_id) {
      data.email = hs.email || "";
      data.runner_id = runner_id;

      var initiator = initiators[data.initiator_id];
      initiator.emit("suite_complete", data);
    });
  });
}

