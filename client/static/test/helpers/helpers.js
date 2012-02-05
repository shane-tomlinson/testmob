TestMob.TestHelpers = (function() {
  "use strict";

  var tm = TestMob,
      xhr = TestMob.Mocks.xhr,
      ajax = TestMob.Ajax;

  function setup() {
    xhr.useResult("success");
    ajax.init({xhr: xhr});
  }

  function teardown() {
    ajax.reset();
  }

  var Helpers = {
    setup: setup,
    teardown: teardown
  };

  return Helpers;
}());

