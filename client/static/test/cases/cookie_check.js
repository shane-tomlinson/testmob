/*global TestMob: true*/
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      CookieCheck = tm.Modules.CookieCheck,
      cookie_check,
      mediator = tm.Mediator,
      xhrEvents;

  module("cookie_check", {
    setup: function() {
      cookie_check = CookieCheck.create({});
    },

    teardown: function() {
      cookie_check.destroy();
    }
  });

  asyncTest("start with cookies enabled - call ready function with true status", function() {
    cookie_check.start({ explicit_status: true, ready: function(err, cookiesEnabled) {
      equal(cookiesEnabled, true, "cookies are enabled");
      start();
    } });
  });

  asyncTest("start with cookies disabled - call ready function with false status, show error screen", function() {
    equal($("#error").length, 0, "error screen not yet added to DOM");
    cookie_check.start({ explicit_status: false, ready: function(err, cookiesEnabled) {
      equal(cookiesEnabled, false, "cookies are disabled");
      equal($("#error").length, 1, "error screen added to DOM");
      start();
    } });
  });

}());

