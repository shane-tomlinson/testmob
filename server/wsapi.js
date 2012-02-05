/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const ROUTES = {
  "POST login": login,
  "POST logout": logout
};

var verifier,
    audience;

function login(req, res) {
  var data = {
    audience: audience,
    assertion: req.body.assertion
  };

  verifier.verify(data, function(err, resp) {
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

  audience = config.audience;

  for(var key in ROUTES) {
    var parts = key.split(" ");
    var type = parts[0].toLowerCase();
    var url = "/wsapi/" + parts[1];

    app[type](url, ROUTES[key]);
  }
}

exports.init = init;
