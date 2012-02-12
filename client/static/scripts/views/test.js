/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Modules.Test = (function() {
  "use strict";

  var tm = TestMob,
      dom = tm.DOM,
      helpers = tm.Helpers,
      ajax = tm.Ajax,
      cancelEvent = helpers.cancelEvent,
      complete = helpers.complete,
      renderer = tm.Renderer,
      sc;

  function updateDisplay() {
    var self = this,
        data = self.model.toObject(),
        selector = "#" + data.test_id,
        target = dom.getElements(selector),
        newTarget = !!target;

    self.unbindAll();

    // sequence is:
    //  remove original target
    //  create new temporary element
    //  write into temporary element
    //  take first child of temporary element and attach it to list
    //  remove temporary element
    //  XXX An AFrame List could be used for this.
    dom.removeElement(target);

    target = dom.createElement("div");
    dom.appendTo(target, "body");

    renderer.render(target, self.template, data);

    dom.appendTo(selector, "#results");
    dom.removeElement(target);

    attachEvents.call(self);
  }

  function attachEvents() {

  }

  var Module = TestMob.Module.extend({
    start: function(options, callback) {
      var self=this;

      self.checkRequired(options, "model");
      self.model = options.model;
      self.template = options.template || "testrunner_results";

      sc.start.call(self, options);
      updateDisplay.call(self);

      self.model.bindEvent("set_complete", updateDisplay, self);

      complete(callback, self);
    }
  });

  sc = Module.sc;

  return Module;
}());

