const assert = require("assert"),
      command = require("../../commands/suite_start"),
      SocketMock = require("../mocks/socket").Socket;

describe("suite_start", function() {
  beforeEach(function() {
  });

  it("should set up a relay", function() {
    command.init({ socket: new SocketMock() });
  });
});

