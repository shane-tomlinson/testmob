/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Models.AssociateTest = (function() {
  "use strict";

  var tm = TestMob,
      sc;

  function getID() {
    var id = "",
        alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for(var i=0; i < 5; i++) id += alpha.charAt(Math.floor(Math.random() * alpha.length));

    return id;
  }
  var Model = tm.Models.Test.extend({
    init: function(config) {
      var self=this;

      sc.init.call(self, config);

      self.set("start_time", new Date().getTime());
      self.set("test_id", getID());
    },

    update: function(data) {
      var self = this;
      ['total', 'passed', 'failed'].forEach(function(key, index) {
        self.set(key, self.get(key) + data[key]);
      });

      self.set("runtime", new Date().getTime() - self.get("start_time"));
      if(data.failed) {
        var failed_tests = self.get("failed_tests");
        failed_tests.push(data.name);
        self.set("failed_tests", failed_tests);
      }
      self.triggerEvent("set_complete");
    }
  });

  sc = Model.sc;

  return Model;
}());

