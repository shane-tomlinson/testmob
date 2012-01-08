const sockets = require("./sockets");

const ROUTES = {
  'GET index.html': redirect_to_index,
  'GET ': index,
  'POST join_family': join_family,
  'GET family/:family_name': family
};

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
  render(req, res, "index.ejs");
}

function join_family(req, res) {
  var family_name = req.body.family_name;
  req.session.family_name = family_name;
  res.redirect("/family/" + family_name);
}

function family(req, res) {
  var family_name = req.params.family_name;

  sockets.start_family(family_name);
  render(req, res, "family.ejs", { title: family_name + " Family" });
}

function init(config) {
  var app = config.app;

  for(var key in ROUTES) {
    var parts = key.split(" "),
        method = parts[0].toLowerCase(),
        url = "/" + (parts[1] || "");

    app[method](url, ROUTES[key]);
  }
}

exports.init = init;
