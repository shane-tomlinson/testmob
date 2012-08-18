/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      modules = tm.Modules,
      Test = modules.Test,
      Model = tm.Models.Test,
      xhr = tm.Mocks.xhr,
      mediator = tm.Mediator,
      model,
      view;

  function createModel(id) {
    var model = Model.create({
      data: {
        client_id: "client_id",
        test_id: id,
        email: "testuser@testuser.com",
        url: "http://testurl.org",
        complete: false,
        passed: 0,
        failed: 0
      }
    });

    return model;
  }

  function createView(options, complete) {
    options = $.extend(options || {}, { target: options.target || "#test_result"});
    var view = Test.create(options, complete);
    return view;
  }

  module("views/test", {
    setup: function() {
      model = createModel("test_1");
    },

    teardown: function() {
      model.teardown();
    }
  });

  asyncTest("model that is incomplete - list item has incomplete class, body has tests class", function() {
    equal($("body").hasClass("tests"), false, "body does not have tests class");
    createView({ data: model }, function(view) {
      ok(view, "view created");
      ok($("body").hasClass("tests"), "body has tests class");
      equal($("#test_result").hasClass("incomplete"), true, "incomplete class added to element");
      start();
    });
  });

  asyncTest("model with failed - has failed class", function() {
    model.set("failed", 1);

    createView({ data: model }, function(view) {
      equal($("#test_result").hasClass("failed"), true, "failed class added to element");
      start();
    });
  });

  asyncTest("model that is complete with no failure - has passed class", function() {
    model.set("failed", 0);
    model.set("passed", 1);
    model.set("complete", true);

    createView({ data: model }, function(view) {
      equal($("#test_result").hasClass("passed"), true, "passed class added to element");
      start();
    });
  });


  asyncTest("model with failed_tests - print failed test names", function() {
    model.set("failed", 1);
    model.set("failed_tests", ["failed test name"]);

    createView({ data: model }, function(view) {
      equal(view.getTarget().find(".failures ul").children().length, 1, "one failure added");
      start();
    });
  });

  asyncTest("multiple views with failed_tests - only update correct view", function() {
    createView({ data: model }, function(view) {
      createView({ data: createModel("test2"), target: "#unaffected_test" }, function(unaffectedView) {
        model.set("failed", 1);
        model.set("failed_tests", ["failed test name"]);
        model.triggerEvent("set_complete");

        equal(view.getTarget().find(".failures ul").children().length, 1, "one failure added");
        equal(unaffectedView.getTarget().find(".failures ul").children().length, 0, "no failures added to the unaffected view");
        start();
      });
    });
  });

  asyncTest("stopSuite - trigger the stop_suite message", function() {
    createView({ data: model }, function(view) {
      mediator.subscribe("stop_suite", function(msg, data) {
        equal(data.test_id, "test_1", "correct test_id passed");
        equal(data.client_id, "client_id", "correct client_id passed");
        start();
      });

      view.stopSuite();
    });
  });
}());
