#!/usr/bin/env node

const express = require("express")
      postprocess = require("postprocess"),
      MemoryStore = express.session.MemoryStore,
      sessionStore = new MemoryStore(),
      app = express.createServer(),
      views = require("./views"),
      wsapi = require("./wsapi"),
      verifier = require("./verifier"),
      sockets = require("./sockets");

const IP_ADDRESS=process.env['IP_ADDRESS'] || undefined;
const PORT=process.env['PORT'] || 5000;
var URL = "testmob.org";

if(IP_ADDRESS) {
  URL = IP_ADDRESS;
}

app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({
    store: sessionStore,
    secret: "TestSwarm Rocks.",
    key: "express.sid" }));
  app.use(express.bodyParser());

  if(URL != "testmob.org") {
    var regExp = new RegExp("testmob.org", "g");
    app.use(postprocess.middleware(function(req, buffer) {
      return buffer.toString().replace(regExp, URL);
    }));
  }

  var root = __dirname + '/../client/';
  app.use(express.static(root + "static/"));
  app.set('views', root + 'templates/');
});

views.init({ app: app });
wsapi.init({ app: app, verifier: verifier });
sockets.init({ app: app, sessionStore: sessionStore });

app.listen(PORT, IP_ADDRESS);

