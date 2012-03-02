exports.test = function(name) {
  const assert = require("assert"),
        command = require("../../commands/" + name),
        Socket = require("../mocks/socket").Socket,
        CommandRelay = require("../../command_relay");

  var client_socket,
      initiator_socket,
      clients;

  describe(name, function() {
    beforeEach(function() {
      initiator_socket = new Socket();
      clients = { initiator: initiator_socket };
      CommandRelay.init({ clients: clients });

      client_socket = new Socket();
      command.bind({ socket: client_socket });
    });

    it("should set up a relay to the initiator", function(done) {
      initiator_socket.bind(name, function(data) {
        done();
      });
      client_socket.trigger(name, { initiator_id: "initiator" });
    });
  });
};
