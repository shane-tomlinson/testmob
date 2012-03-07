const assert = require("assert"),
      command_relay = require("../../command_relay"),
      SocketMock = require("../mocks/socket").Socket;

var clients = {},
    client_socket,
    initiator_socket;

describe("command_relay", function() {
  beforeEach(function() {
    command_relay.init({ clients: clients });

    client_socket = new SocketMock();
    clients["CLIENT"] = client_socket;

    initiator_socket = new SocketMock();
    clients["INITIATOR"] = initiator_socket;
  });

  it("should set up a relay to the initiator", function(done) {
    command_relay.command_relay(client_socket, "relayed_message");

    // simulate the binding to an "on" on the initiator.
    clients["INITIATOR"].bind("relayed_message", function(data) {
      assert.equal(data.runner_id, "CLIENT", "correct runner_id");
      done();
    });

    client_socket.trigger("relayed_message", { client_id: "CLIENT", target_id: "INITIATOR" });
  });
});

