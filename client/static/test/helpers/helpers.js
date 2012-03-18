/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.TestHelpers = (function() {
  "use strict";

  var tm = TestMob,
      xhr = TestMob.Mocks.xhr,
      ajax = TestMob.Ajax,
      mediator = TestMob.Mediator;

  function setup() {
    xhr.useResult("success");
    ajax.init({xhr: xhr});
    mediator.reset();
    $("body").removeClass("tests");
    $("#error").remove();
  }

  function teardown() {
    ajax.reset();
    mediator.reset();
    $("body").removeClass("tests");
    $("#error").remove();
  }

  var Helpers = {
    setup: setup,
    teardown: teardown
  };

  return Helpers;
}());

