TestMob.Models = {};

TestMob.Model = (function() {
  "use strict";

  var tm = TestMob,
      sc;

  var Model = AFrame.Model.extend({
    toObject: function() {
      return this.toJSON();
    }
  });

  sc = Model.sc;

  return Model;

}());

