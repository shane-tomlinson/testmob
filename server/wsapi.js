const ROUTES = {
  "POST login": login,
  "POST logout": logout
};

var verifier;

function login(req, res) {
  verifier.verify(req.body, function(err, resp) {
    if(err) {
      res.json({
        success: false
      }, 403);
    }
    else {
      req.session.email = resp.email;
      res.json(resp);
    }
  });
};

function logout(req, res) {
  req.session.email = null;
  res.json({ success: true });
};

function init(config) {
  verifier = config.verifier;
  if(!verifier) {
    throw "missing config option: verifier";
  }

  var app = config.app;
  if(!app) {
    throw "missing config option: app";
  }


  for(var key in ROUTES) {
    var parts = key.split(" ");
    var type = parts[0].toLowerCase();
    var url = "/wsapi/" + parts[1];

    app[type](url, ROUTES[key]);
  }
}

exports.init = init;
