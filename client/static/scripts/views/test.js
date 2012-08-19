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
    addClassIfTrue.call(self, data.log.length, "has_logs");
    addClassIfTrue.call(self, data.warn.length, "has_warnings");
    addClassIfTrue.call(self, data.error.length, "has_errors");

    dom.addClass("body", "tests");

    printElements.call(self, ".failures ul", data, "failed_tests");
    printElements.call(self, ".logs ul", data, "log");
    printElements.call(self, ".warnings ul", data, "warn");
    printElements.call(self, ".errors ul", data, "error");
  }

  function printElements(listSelector, data, fieldName) {
    var self=this,
        target = dom.getDescendentElements(listSelector, self.getTarget()),
        field = data[fieldName];

    if(field) {
      var fieldCount = field.length;
      // Only add new items to the list.
      for(var index = self.startIndecis[fieldName]; index < fieldCount; index++) {
        var item = field[index],
            itemText = item.test_name;

        if(item.msg) itemText += (": " + item.msg);

        var el = dom.createElement("li", itemText);
        dom.appendTo(el, target);
      }
      self.startIndecis[fieldName] = fieldCount;
    }

  }

  function stopSuite() {
    mediator.publish("stop_suite", this.dataContainer.toObject());
  }

  var Module = AFrame.DataForm.extend({
    init: function(options, callback) {
      var self=this;

      sc.init.call(self, options);

      self.failureStartIndex = 0;
      self.startIndecis = {
        failed_tests: 0,
        log: 0,
        warn: 0,
        error: 0
      };
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

