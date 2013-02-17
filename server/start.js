#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express = require('express')
      MemoryStore = express.session.MemoryStore,
      sessionStore = new MemoryStore(),
      path = require('path');
      cachify = require('connect-cachify'),
      app = express(),
      server = require('http').createServer(app),
      sockets = require('./sockets'),
      views = require('./views'),
      wsapi = require('./wsapi'),
      verifier = require('./verifier'),
      assets = require('./assets').assets,
      config = require('./config').config,
      redis =  require('redis-url'),
      connect_fonts = require('connect-fonts'),
      chunkfive = require('connect-fonts-chunkfive'),
      substitute = require('connect-substitute');

const IP_ADDRESS=config.ip_address;
const PORT=config.port;
const URL = config.url;
const FULL_URL = ( config.https ? "https://" : "http://" ) + URL;
const REDIS_URL = config.redis_url;

const root = path.join(__dirname, '..', 'client');
const template_path = path.join(root, 'templates');
const static_path = path.join(root, 'static');

app.configure(function(){
  app.engine('ejs', require('ejs').__express);
  app.set('views', template_path);

  var cookieParser = express.cookieParser("TestSwarm Rocks.");
  app.use(cookieParser);
  app.use(express.session({
    store: sessionStore,
    key: "express.sid" }));
  app.use(express.bodyParser());

  if(URL !== "testmob.org") {
    console.log(FULL_URL);
    app.use(substitute.setup({
      from: "https://testmob.org",
      to: FULL_URL
    }));
  }

  var font_middleware = connect_fonts.setup({
    fonts: [ chunkfive ],
    allow_origin: FULL_URL
  });

  app.use(cachify.setup(assets, {
      root: static_path,
      production: config.use_minified_resources,
      url_to_paths: connect_fonts.urlToPaths
  }));

  app.use(font_middleware);

  for(var key in redis) {
    console.log(key);
  }
  var db = redis.createClient(REDIS_URL);

  sockets.init({ server: server, sessionStore: sessionStore, db: db, cookieParser: cookieParser });
  views.init({ app: app, db: db });
  wsapi.init({ app: app, verifier: verifier, audience: ( config.https ? "https://" : "http://" ) + URL});



  app.use(express.static(static_path));
});

server.listen(PORT, IP_ADDRESS);

