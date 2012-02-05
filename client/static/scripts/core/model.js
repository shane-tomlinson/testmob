/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Models = {};

TestMob.Model = (function() {
  "use strict";

  var tm = TestMob,
      sc;

  var Model = AFrame.Model.extend({
    toObject: function() {
      return this.toJSON();
    },

    set: function(key) {
      sc.set.apply(this, arguments);
      if(typeof key !== "string") {
        this.triggerEvent("set_complete");
      }
    }
  });

  sc = Model.sc;

  return Model;

}());

