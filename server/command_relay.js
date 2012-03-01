/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var clients;

exports.init = function(config) {
  clients = config.clients;
};

exports.command_relay = function(socket, message) {
  console.log("setting up relay: " + message);
  socket.on(message, function(data) {
    data.runner_id = data.client_id;

    console.log("relaying: " + message);

    // We use the initiator_id instead of passing the initiator's socket
    // directly because each client could be running tests from
    // multiple initiators.
    var initiator = clients[data.initiator_id];
    if(initiator) {
      initiator.emit(message, data);
    }
  });
};

