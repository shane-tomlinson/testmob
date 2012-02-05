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

