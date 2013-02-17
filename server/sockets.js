/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const socket = require("socket.io"),
      /*Session = require("connect").middleware.session.Session,*/
      /*parseCookie = require("connect").utils.parseSignedCookie,*/
      SessionSockets = require('session.socket.io'),
      request_start_suite = require("./commands/request_start_suite"),
      command_relay = require("./command_relay"),
      commands = require("./commands"),
      app_config = require("./config").config;

var io,
    sessionSockets,
    families,
    db,
    clients = {};


exports.init = function(config) {
  var server = config.server;
  if(!server) {
    throw "missing config option: server";
  }


  families = {};
  db = config.db;
  command_relay.init({ clients: clients });
  commands.init(function() {
    commands.forEach(function(command) {
      if(command.init) {
        command.init({ db: db, clients: clients });
      }
    });

    io = socket.listen(server);

    sessionSockets = new SessionSockets(io, config.sessionStore, config.cookieParser);

    io.configure(function() {
      var socketConfig = app_config["socket.io"];
      for(key in socketConfig) {
        io.set(key, socketConfig[key]);
      }
    });
  });
};

exports.start_family = function(family_name) {
  if(!families[family_name]) {
    sessionSockets.of("/" + family_name).on('connection', socket_connection);
    families[family_name] = true;
  }
};

function getSocketID() {
  // XXX combind this with the one in request_start_suite
  var id = "",
      alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for(var i=0; i < 5; i++) id += alpha.charAt(Math.floor(Math.random() * alpha.length));

  return id;
}

function socket_connection(err, socket, session) {
  var socketID = getSocketID();
  clients[socketID] = socket;
  socket.emit("set_client_id", { client_id: socketID });


  commands.forEach(function(command) {
    if(command.bind) {
      command.bind({ socket: socket });
    }
  });
}

