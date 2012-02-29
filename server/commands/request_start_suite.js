
var db;

function getTestID(cb) {
  db.get("tests_started", function(err, value) {
    if(err) cb("increment_test_count", null);

    var tests_started = ~~value;
    tests_started++;
    db.set("tests_started", tests_started);
    cb(null, tests_started);
  });
}

exports.init = function(config) {
  db = config.db;
};

exports.request_start_suite = function(initiator_data, test_data, cb) {
  console.log("requesting start suite");
  getTestID(function(err, value) {
    if(err) {
      cb(err, null);
    }
    else {
      test_data.test_id = value;
      test_data.initiator_id = initiator_data.id;
      test_data.email = initiator_data.email;

      console.log("initiator: " + initiator_data.id);
      cb(null, test_data);
    }
  });
};

