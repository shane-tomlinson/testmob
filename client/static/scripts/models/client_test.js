/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Models.ClientTest = (function() {
  "use strict";

  var tm = TestMob,
      sc;

  var Model = tm.Models.Test.extend({
    init: function(config) {
      var self=this;

      sc.init.call(self, config);

      self.set("start_time", new Date().getTime());
      self.set("userAgent", navigator.userAgent);
    },

    update: function(data) {
      var self = this;
      ['total', 'passed', 'failed'].forEach(function(key, index) {
        self.set(key, self.get(key) + data[key]);
      });

      self.set("runtime", new Date().getTime() - self.get("start_time"));
      self.triggerEvent("set_complete");
    }
  });

  sc = Model.sc;

  return Model;
}());

