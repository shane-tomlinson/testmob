/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const socket = require("socket.io"),
      Session = require("connect").middleware.session.Session,
      parseCookie = require("connect").utils.parseCookie,
      request_start_suite = require("./commands/request_start_suite");

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
  request_start_suite.init({ db: db });
};

exports.start_family = function(family_name) {
  if(!families[family_name]) {
    console.log('family started: ' + family_name);
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

function getSocketID() {
  var id=socket_id;
  socket_id++;
  return id;
}

function socket_connection(socket) {
  console.log("set client id");

  var hs = socket.handshake,
      socketID = getSocketID();

  socket.emit("set_id", { client_id: socketID });

  socket.on('request_start_suite', function (data) {
    var id = data.client_id;

    console.log("request_start_suite started");
    // XXX this will have to be torn down.
    initiators[id] = socket;

    var initiator_data = { id: id, email: hs.email };
    request_start_suite.request_start_suite(initiator_data, data, function(err, resp) {
      if(err) return;

      socket.broadcast.emit("start_suite", resp);
    });
  });

  proxyCommand("suite_start");
  proxyCommand("test_done");
  proxyCommand("suite_complete");

  function proxyCommand(message) {
    socket.on(message, function(data) {
      data.runner_id = data.client_id;
      data.email = hs.email;
      var initiator = initiators[data.initiator_id];
      if(initiator) {
        initiator.emit(message, data);
      }
    });
  }
}

