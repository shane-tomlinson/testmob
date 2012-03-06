/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const socket = require("socket.io"),
      Session = require("connect").middleware.session.Session,
      parseCookie = require("connect").utils.parseCookie,
      request_start_suite = require("./commands/request_start_suite"),
      command_relay = require("./command_relay"),
      commands = require("./commands");

var io,
    families,
    db,
    initiators = {};


exports.init = function(config) {
  var app = config.app;
  if(!app) {
    throw "missing config option: app";
  }


  families = {};
  db = config.db;
  command_relay.init({ clients: initiators });
  commands.init(function() {
    commands.forEach(function(command) {
      if(command.init) {
        command.init({ db: db, clients: initiators });
      }
    });

    io = socket.listen(app);
    io.configure(function() {
      // required for Heroku.
      // http://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
      io.set("transports", ["xhr-polling"]);
      io.set("polling duration", 10);

      io.set("authorization", socket_authorization);
      io.set("log level", 2);
      io.set("browser client gzip", true);
      io.set("browser client minification", true);
      io.set("browser client etag", true);
    });
  });
};

exports.start_family = function(family_name) {
  if(!families[family_name]) {
    io.of("/" + family_name).on('connection', socket_connection);
    families[family_name] = true;
  }
};

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
  // XXX combind this with the one in request_start_suite
  var id = "",
      alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for(var i=0; i < 5; i++) id += alpha.charAt(Math.floor(Math.random() * alpha.length));

  return id;
}

function socket_connection(socket) {
  var socketID = getSocketID();
  socket.emit("set_client_id", { client_id: socketID });

  commands.forEach(function(command) {
    if(command.bind) {
      command.bind({ socket: socket });
    }
  });
}

