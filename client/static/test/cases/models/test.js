/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      Test = tm.Models.Test,
      model;

  module("model/test", {
    setup: function() {
      model = Test.create({});
    },

    teardown: function() {
      model.teardown();
      model = null;
    }
  });

  test("can create - default start_time set to (almost) now", function() {
    ok(model, "model created");

    var now = new Date().getTime();
    var startTime = model.get("start_time");

    var diff = now - startTime;

    ok(diff <= 5, "start_time is within 5 ms of now: " + diff);
  });

  asyncTest("complete - sets the complete flag and triggers set_complete",
  function() {
    model.bindEvent("set_complete", function() {
      equal(model.get("complete"), true, "complete set to true");
      start();
    });
    model.complete();
  });
}());

