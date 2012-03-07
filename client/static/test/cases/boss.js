/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      Boss = tm.Modules.Boss,
      Socket = tm.Mocks.Socket,
      mediator = tm.Mediator,
      boss,
      socket;

  module("boss", {
    setup: function() {
      socket = new Socket().connect("http://testmob.org");
      boss = Boss.create({});
      boss.start({
        socket: socket
      });
    },

    teardown: function() {
    }
  });

  asyncTest("stop_suite on the mediator - emit stop_suite on the socket", function() {
    socket.bind("stop_suite", function(data) {
      equal(data.test_id, "test_id", "test_id passed correctly");
      equal(data.target_id, "runner_id", "runner_id converted to target_id correctly");
      start();
    });

    mediator.publish("stop_suite", { test_id: "test_id", runner_id: "runner_id" });
  });
}());
