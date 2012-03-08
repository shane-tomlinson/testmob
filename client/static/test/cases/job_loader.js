/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      JobLoader = tm.JobLoader,
      jobLoader;

  module("job_loader", {
    setup: function() {
    },

    teardown: function() {
      $(".test_frame").remove();
    }
  });

  asyncTest("load a script that sends suite_complete - send suite_complete", function() {
    JobLoader.load({
      url: "/test/test_job.html"
    }, function(err, data) {
      equal(data.msg, "suite_complete", "correct message");
      equal(data.passed, 1, "correct passed");
      equal(data.failed, 1, "correct failed");
      equal(data.total, 2, "correct total");
      equal(data.runtime, 3, "correct runtime");
      start();
    });
  });

  asyncTest("load then remove - remove the iframe", function() {
    JobLoader.load({
      url: "/test/long_job.html"
    }, function(err, data) {
      JobLoader.remove();
      equal($(".test_frame").length, 0, "no test frames remaining after remove");
      start();
    });
  });

}());
