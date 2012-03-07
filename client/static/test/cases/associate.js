/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      Associate = tm.Modules.Associate,
      associate,
      Socket = tm.Mocks.Socket,
      socket;

  module("associate", {
    setup: function() {
      var sock = new Socket();
      socket = sock.connect("http://testmob.org");
      associate = Associate.create({});
      associate.start({
        socket: socket
      });

    },

    teardown: function() {
    }
  });

  asyncTest("start_suite - start a set of tests", function() {
    // test_job triggers a suite_complete message.
    socket.bind("suite_complete", function(data) {
      ok(true, "test has completed");
      start();
    });

    socket.trigger("start_suite", { url: "/test/test_job.html" });
  });

  asyncTest("getModel - get the current model", function() {
    socket.bind("suite_complete", function(data) {
      var model = associate.getModel();
      ok(model, "A model is created once a suite has been started");
      start();
    });

    var model = associate.getModel();
    equal(typeof model, "undefined", "A model is not created until a suite has been started");
    socket.trigger("start_suite", { url: "/test/test_job.html" });
  });

  asyncTest("stop_suite - stop a set of tests", function() {
    socket.bind("suite_stopped", function() {
      ok(true, "suite has been stopped");
      var model = associate.getModel();
      equal(model.get("force_stopped"), true, "model.stopped set to true");
      start();
    });

    socket.trigger("start_suite", { url: "/test/long_job.html" });
    socket.trigger("stop_suite");
  });
}());
