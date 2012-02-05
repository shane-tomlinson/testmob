/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      modules = tm.Modules,
      Auth = modules.Authentication,
      BrowserID = tm.Mocks.BrowserID,
      Model = tm.Models.Authentication,
      testHelpers = tm.TestHelpers,
      xhr = tm.Mocks.xhr,
      model,
      view;

  module("views/authentication", {
    setup: function() {
      model = Model.create({authenticated: false, email: "", browserid: BrowserID});
      testHelpers.setup();
      $("#authentication").empty();
    },

    teardown: function() {
      testHelpers.teardown();
      if(view) {
        view.destroy();
        view = null;
      }
    }
  });

  function createView(options, complete) {
    var view = Auth.create();

    options = $.extend(options || {}, {
      browserid: BrowserID
    });
    view.start(options, complete);
    return view;
  }

  asyncTest("create with unauthenticated user - signin button shown", function() {
    model.set("authenticated", false);
    createView({ model: model }, function() {
      ok($("#signin").length, "signin shown");
      start();
    });
  });

  asyncTest("create with authenticated user - user email and signout button shown", function() {
    model.set("authenticated", true);
    model.set("email", "testuser@testuser.com");

    createView({ model: model }, function() {
      equal($("#user_email").text(), "testuser@testuser.com", "correct email shown");
      ok($("#signout").length, "signout shown");
      start();
    });
  });

  asyncTest("signin goes to model to signin - update view", function() {
    model.set("authenticated", false);

    createView({ model: model }, function(view) {
      view.signin(function() {
        equal($("#user_email").text(), "testuser@testuser.com", "correct email shown");
        ok($("#signout").length, "signout shown");
        start();
      });

      BrowserID.complete("assertion");
    });
  });

  asyncTest("signout goes to model to signout - update view", function() {
    model.set("authenticated", true);
    model.set("email", "testuser@testuser.com");

    createView({ model: model }, function(view) {
      view.signout(function() {
        ok($("#signin").length, "signin shown");
        start();
      });

      BrowserID.complete("assertion");
    });
  });

}());
