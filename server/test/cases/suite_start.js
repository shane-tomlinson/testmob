const assert = require("assert"),
      command = require("../../commands/suite_start"),
      Socket = require("../mocks/socket").Socket,
      CommandRelay = require("../../command_relay");

var client_socket,
    initiator_socket,
    clients;

describe("suite_start", function() {
  beforeEach(function() {
    initiator_socket = new Socket();
    clients = { initiator: initiator_socket };
    CommandRelay.init({ clients: clients });

    client_socket = new Socket();
    command.bind({ socket: client_socket });
  });

  it("should set up a relay to the initiator", function(done) {
    initiator_socket.bind("suite_start", function(data) {
      done();
    });
    client_socket.trigger("suite_start", { initiator_id: "initiator" });
  });
});

