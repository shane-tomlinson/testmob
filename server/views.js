/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const sockets = require("./sockets");

const ROUTES = {
  'GET index.html': redirect_to_index,
  'GET ': index,
  'GET about': about,
  'GET use': use,
  'POST join_family': join_family,
  'GET family/:family_name': family,
  'GET test': test,
  'GET test/index.html': test,
};

var db;

function render(req, res, template, data) {
  data = data || {};
  if(req.session.email) {
    data.email = req.session.email;
  }
  res.render(template, data);
}

function redirect_to_index(req, res) {
  // perm redirect to /
  res.redirect("/", 301);
}

function index(req, res) {
  db.get("tests_started", function(err, value) {
    value = value || 0;

    render(req, res, "index.ejs", { tests_started: value });
  });
}

function about(req, res) {
  render(req, res, "about.ejs", { title: "About" });
}

function use(req, res) {
  render(req, res, "use.ejs", { title: "How to Use" });
}

function join_family(req, res) {
  var family_name = req.body.family_name,

  // replace any spaces or %20s in the family name
  family_name = family_name.replace(/ /g, '_');
  family_name = family_name.replace(/%20/g, '_');

  req.session.family_name = family_name;
  res.redirect("/family/" + family_name);
}

function family(req, res) {
  var family_name = req.params.family_name;

  sockets.start_family(family_name);
  render(req, res, "family.ejs", { title: "Family: " + family_name, family: family_name });
}

function test(req, res) {
  render(req, res, "test.ejs", { title: "Unit Tests", layout: false });
}


function init(config) {
  var app = config.app;
  db = config.db;

  for(var key in ROUTES) {
    var parts = key.split(" "),
        method = parts[0].toLowerCase(),
        url = "/" + (parts[1] || "");

    app[method](url, ROUTES[key]);
  }
}

exports.init = init;
