/*global TestMob: true*/
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Models.Authentication = (function() {
  "use strict";

  var tm = TestMob,
      ajax = tm.Ajax,
      complete = tm.Helpers.complete,
      sc,
      browserid;

  function authenticate(assertion, callback) {
    /*jshint validthis: true*/
    var self=this;
    ajax.post("/wsapi/login", {
      assertion: assertion,
      audience: document.location.hostname
    }, function(err, resp) {
      if(err) {
        // XXX handle error;
      }
      else {
        self.set("authenticated", resp.success);
        self.set("email", resp.success ? resp.email : "");
        complete(callback, null, resp.success);
      }
    });
  }

  function signin(callback) {
    /*jshint validthis: true*/
    var self=this;
    self.onlogin = callback;
    browserid.request({
      siteName: "TestMob"/*,
      siteLogo: "/img/logo_small.png"*/
    });
  }

  function signout(callback) {
    /*jshint validthis: true*/
    var self=this;
    self.onlogout = callback;
    ajax.post("/wsapi/logout", {}, function(err, resp) {
      if(err) {
        // XXX handle error;
      }
      else {
        browserid.logout();
      }
    });
  }

  function watch() {
    /*jshint validthis: true*/
    var self=this;
    browserid.watch({
      loggedInEmail: window.authenticated_email || null,
      onlogin: function(assertion) {
        if(assertion) {
          authenticate.call(self, assertion);
          complete(self.onlogin, null, true);
        }
        else {
          complete(self.onlogin, "no assertion");
        }
      },
      onlogout: function() {
        self.set("authenticated", false);
        self.set("email", null);
        complete(self.onlogout);
      }
    });
  }

  var Model = TestMob.Model.extend({
    schema: {
      authenticated: { type: "boolean", def: false },
      email: { type: "string", def: undefined }
    },
    init: function(config) {
      browserid = config.browserid || navigator.id;
      watch.call(this);
      sc.init.call(this, config);
    },

    signin: signin,
    signout: signout
  });

  sc = Model.sc;

  return Model;

}());

