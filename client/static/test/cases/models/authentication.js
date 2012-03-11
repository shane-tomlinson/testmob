/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      Auth = tm.Models.Authentication,
      BrowserID = tm.Mocks.BrowserID,
      ajax = tm.Ajax,
      xhr = tm.Mocks.xhr,
      model;

  module("models/authentication", {
    setup: function() {
    },

    teardown: function() {
      BrowserID.reset();
      if(model) {
        model.teardown();
        model = null;
      }
    }
  });

  function createModel(options) {
    options = $.extend(options || {}, {
      browserid: BrowserID
    });

    var model = Auth.create(options);
    return model;
  }

  test("start with authenticated set to true - authenticated set to true", function() {
    model = createModel({ data: {authenticated: true }});
    equal(model.get("authenticated"), true, "user is authenticated");
  });

  asyncTest("signin - signs user in with browserid, sets authenticated to true, sets email", function() {
    model = createModel({});
    model.signin(function(err, status) {
      equal(err, null, "correct error status");
      equal(status, true, "correct status");

      equal(model.get("authenticated"), true, "user is authenticated");
      equal(model.get("email"), "testuser@testuser.com", "correct email set");
      start();
    });

    BrowserID.complete("assertion");
  });

  asyncTest("signout - signs out authenticated user", function() {
    model = createModel({ data: {authenticated: true }});
    model.signout(function() {
      equal(model.get("authenticated"), false, "user is no longer authenticated");
      start();
    });

    BrowserID.complete();
  });
}());
