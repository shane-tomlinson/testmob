var verifier,
    clients;

exports.init = function(config) {
  verifier = config.verifier;
  clients = config.clients;
};

exports.login = function(data, cb) {
  verifier.verify(data, function(err, resp) {
    cb(err, resp);
  });
};



