/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      AssociateTest = tm.Models.AssociateTest,
      model;

  module("model/associate_test", {
    setup: function() {

    },

    teardown: function() {

    }
  });

  test("init - sets start_time, test_id", function() {
    model = AssociateTest.create({});
    var now = new Date().getTime();
    ok(now - model.get("start_time") < 5, "start time set correctly");
    ok(model.get("test_id"), "test_id is set");
  });

  test("all models have different test_id's", function() {
    model = AssociateTest.create({});
    var model2 = AssociateTest.create({});

    notEqual(model.get("test_id"), model2.get("test_id"), "test_ids are not the same");
  });

  asyncTest("update - adds to total, passed and failed, update runtime", function() {
    model = AssociateTest.create({});

    model.set({ total: 1, passed: 1, failed: 1, log: ["initial log"],
      warn: ["initial warning"], error: ["initial error"]});

    setTimeout(function() {
      model.update({ total: 2, passed: 3, failed: 4, name: "Failing Test Name", log: ["second log message"], warn: ["second warning"], error: ["second error"] });

      equal(model.get("total"), 3, "total updated");
      equal(model.get("passed"), 4, "passed updated");
      equal(model.get("failed"), 5, "failed updated");
      equal(model.get("failed_tests")[0].test_name, "Failing Test Name", "failing test name added to list");
      equal(model.get("log")[1].test_name, "Failing Test Name", "logs added");
      equal(model.get("log")[1].msg, "second log message", "logs added");
      equal(model.get("warn")[1].msg, "second warning", "warnings added");
      equal(model.get("error")[1].msg, "second error", "errors added");

      ok(model.get("runtime") > 0, "runtime set");
      start();
    }, 1);
  });


}());

