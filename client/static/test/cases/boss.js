/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      Boss = tm.Modules.Boss,
      Socket = tm.Mocks.Socket,
      XHREvents = tm.XHREvents,
      mediator = tm.Mediator,
      boss,
      xhrEvents;

  module("boss", {
    setup: function() {
      xhrEvents = XHREvents.create({});
      xhrEvents.start({
        io: Socket,
        url: "http://testmob.org"
      });

      boss = Boss.create({});
      boss.start({
        xhrEvents: xhrEvents
      });
    },

    teardown: function() {
    }
  });

  asyncTest("stop_suite on the mediator - emit stop_suite on the socket", function() {
    xhrEvents.subscribe("stop_suite", function(msg, data) {
      equal(data.test_id, "test_id", "test_id passed correctly");
      equal(data.target_id, "runner_id", "runner_id converted to target_id correctly");
      start();
    });

    mediator.publish("stop_suite", { test_id: "test_id", runner_id: "runner_id" });
  });
}());
