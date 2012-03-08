(function() {
  "use strict";

  var testHelpers = TestMob.TestHelpers;

  QUnit.testStart = function() {
    testHelpers.setup();
  };

  QUnit.testDone = function() {
    testHelpers.teardown();
  };

}());
