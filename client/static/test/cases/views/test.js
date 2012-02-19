/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      modules = tm.Modules,
      Test = modules.Test,
      Model = tm.Models.Test,
      testHelpers = tm.TestHelpers,
      xhr = tm.Mocks.xhr,
      model,
      view;

  function createModel(id) {
    var model = Model.create({
      data: {
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
    options = $.extend(options || {}, { target: "#test_result"});
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

  asyncTest("model that is incomplete - has incomplete class", function() {
    createView({ data: model }, function(view) {
      ok(view, "view created");
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
}());
