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

  module("views/test", {
    setup: function() {
      model = Model.create({
        data: {
          test_id: 0,
          email: "testuser@testuser.com",
          url: "http://testurl.org"
        }
      });
      testHelpers.setup();
    },
    teardown: function() {
      testHelpers.teardown();
    }
  });

  function createView(options, complete) {
    var view = Test.create();

    options = $.extend(options || {}, {
    });
    view.start(options, complete);
    return view;
  }

  asyncTest("can create", function() {
    createView({ model: model }, function(view) {
      ok(view, "view created");
      start();
    });
  });

}());