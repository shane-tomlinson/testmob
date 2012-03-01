
var db,
    clients;

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

function request_start_suite(initiator_data, test_data, cb) {
  incrementTestCount(function(err, value) {
    if(err) {
      cb(err, null);
    }
    else {
      test_data.test_id = getID();
      test_data.initiator_id = initiator_data.id;

      cb(null, test_data);
    }
  });
};

exports.init = function(config) {
  db = config.db;
  clients = config.clients;
};


exports.bind = function(config) {
  var socket = config.socket;

  socket.on('request_start_suite', function (data) {
    var id = data.client_id;

    clients[id] = socket;

    request_start_suite({ id: id }, data, function(err, resp) {
      if(err) return;

      socket.broadcast.emit("start_suite", resp);
    });
  });
};

