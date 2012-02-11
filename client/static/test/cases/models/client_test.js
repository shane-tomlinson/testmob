/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      ClientTest = tm.Models.ClientTest,
      model;

  module("model/client_test", {
    setup: function() {

    },

    teardown: function() {

    }
  });

  test("init - sets the start time and userAgent", function() {
    model = ClientTest.create({});
    var now = new Date().getTime();
    ok(now - model.get("start_time") < 5, "start time set correctly");
    equal(model.get("userAgent"), navigator.userAgent, "correct userAgent");
  });

  asyncTest("update - adds to total, passed and failed, update runtime", function() {
    model = ClientTest.create({});

    model.set({ total: 1, passed: 1, failed: 1 });

    setTimeout(function() {
      model.update({ total: 2, passed: 3, failed: 4 });

      equal(model.get("total"), 3, "total updated");
      equal(model.get("passed"), 4, "passed updated");
      equal(model.get("failed"), 5, "failed updated");

      ok(model.get("runtime") > 0, "runtime set");
      start();
    }, 1);
  });

}());

