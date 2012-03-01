const assert = require("assert");
const command = require("../../commands/request_start_suite");

const db = {
  tests_started: 1,
  get: function(key, cb) {
    if(key === "tests_started") cb(null, this.tests_started);
  },

  set: function(key, value, cb) {
    this[key] = value;
  }
};

describe("request_start_suite", function() {
  beforeEach(function() {
    command.init({ db: db });
  });

  it('should insert test_id, initiator_id into data, update database', function(done) {
    var test_data = {};
    var initiator_data = { id: "initiator" };

    command.request_start_suite(initiator_data, test_data, function(err, test_data) {
      assert.equal(err, null, "expected null error");

      assert.equal(test_data.initiator_id, "initiator", "correct initiator_id");
      assert.ok(test_data.test_id, "test_id added");

      assert.equal(db.tests_started, 2, "db updated");
      done();
    });
  });
});


