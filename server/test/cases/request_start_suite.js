const assert = require("assert");
const command = require("../../commands/request_start_suite");
const Socket = require("../mocks/socket").Socket;

const db = {
  tests_started: 1,
  get: function(key, cb) {
    if(key === "tests_started") cb(null, this.tests_started);
  },

  set: function(key, value, cb) {
    this[key] = value;
  }
};

var socket;

describe("request_start_suite", function() {
  beforeEach(function() {
    command.init({ db: db, clients: {} });
    socket = new Socket();
    command.bind({ socket: socket });
  });

  it('should insert test_id, initiator_id into data, update database', function(done) {
    var test_data = {};
    var initiator_data = { id: "initiator" };

    socket.broadcast.bind("start_suite", function(data) {
      assert.equal(data.initiator_id, "initiator", "correct initiator_id");
      assert.ok(data.test_id, "test_id added");

      assert.equal(db.tests_started, 2, "db updated");

      done();
    });
    socket.trigger("request_start_suite", { client_id: "initiator" });
  });
});


