/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Modules.Test = (function() {
  "use strict";

  var tm = TestMob,
      dom = tm.DOM,
      mediator = tm.Mediator,
      complete = tm.Helpers.complete,
      sc;

  function addClassIfTrue(test, className) {
    dom[test ? "addClass" : "removeClass"](this.getTarget(), className);
  }

  function updateDisplay() {
    var self = this,
        data = self.dataContainer.toObject();

    addClassIfTrue.call(self, !data.complete, "incomplete");
    addClassIfTrue.call(self, data.complete && !data.failed, "passed");
    addClassIfTrue.call(self, data.failed, "failed");
    addClassIfTrue.call(self, data.force_stopped, "force_stopped");

    dom.addClass("body", "tests");

    var target = dom.getDescendentElements(".failures ul", self.getTarget());

    // Only add new failures to the list.
    var failureCount = data.failed_tests.length;
    for(var index = self.failureStartIndex; index < failureCount; index++) {
      var failure = data.failed_tests[index],
          el = dom.createElement("li", failure);
      dom.appendTo(el, target);
    }
    self.failureStartIndex = failureCount;
  }

  function stopSuite() {
    mediator.publish("stop_suite", this.dataContainer.toObject());
  }

  var Module = AFrame.DataForm.extend({
    init: function(options, callback) {
      var self=this;

      sc.init.call(self, options);

      self.failureStartIndex = 0;
      updateDisplay.call(self);
      self.dataContainer.bindEvent("set_complete", updateDisplay, self);

      self.bindClick(".stop", stopSuite);

      complete(callback, self);
   },

    stopSuite: stopSuite
  });

  sc = Module.sc;

  return Module;
}());

