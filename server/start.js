#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express = require("express")
      postprocess = require("postprocess"),
      MemoryStore = express.session.MemoryStore,
      sessionStore = new MemoryStore(),
      cachify = require("connect-cachify"),
      app = express.createServer(),
      views = require("./views"),
      wsapi = require("./wsapi"),
      verifier = require("./verifier"),
      sockets = require("./sockets"),
      assets = require("./assets").assets,
      config = require("./config").config;

const IP_ADDRESS=config.ip_address;
const PORT=config.port;
const URL = config.url;

const root = __dirname + '/../client/';

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

  app.use(cachify.setup(assets, {
      root: root + "static/",
      production: config.use_minified_resources
  }));
  app.helpers(cachify.helpers);

  app.use(express.static(root + "static/"));
  app.set('views', root + 'templates/');
});

views.init({ app: app });
wsapi.init({ app: app, verifier: verifier, audience: "http://" + URL });
sockets.init({ app: app, sessionStore: sessionStore });

app.listen(PORT, IP_ADDRESS);

