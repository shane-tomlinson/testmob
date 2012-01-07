const ROUTES = {
  '/index.html': index,
  '/': index,
  '/initiator': initiator,
  '/test_runner': test_runner
};

function render(req, res, template, data) {
  data = data || {};
  if(req.session.email) {
    data.email = req.session.email;
  }
  res.render(template, data);
}

function index(req, res) {
  render(req, res, "index.ejs");
}

function initiator(req, res) {
  render(req, res, "initiator.ejs", { title: "Initiate a Test" });
}

function test_runner(req, res) {
  render(req, res, "test_runner.ejs", { title: "Wait for Tests" });
}

function init(config) {
  var app = config.app;

  for(var key in ROUTES) {
    app.get(key, ROUTES[key]);
  }
}

exports.init = init;
