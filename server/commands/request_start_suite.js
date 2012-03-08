
var db;

function incrementTestCount(cb) {
  db.get("tests_started", function(err, value) {
    if(err) cb("increment_test_count", null);

    var tests_started = ~~value;
    tests_started++;
    db.set("tests_started", tests_started);
    cb(null, tests_started);
  });
}

function getID() {
  var id = "",
      alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for(var i=0; i < 5; i++) id += alpha.charAt(Math.floor(Math.random() * alpha.length));

  return id;
}

exports.init = function(config) {
  db = config.db;
};


exports.bind = function(config) {
  var socket = config.socket;

  socket.on('request_start_suite', function (data) {
    var id = data.client_id;

    incrementTestCount(function(err, value) {
      if(!err) {
        data.test_id = getID();
        data.target_id = id;

        socket.broadcast.emit("start_suite", data);
      }
    });
  });
};

