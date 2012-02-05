TestMob.Mocks.BrowserID = (function() {
  "use strict";

  var Mock = {
    init: function(options) {

    },

    reset: function() {

    },

    get: function(callback, options) {
      this.callback = callback;
    },

    logout: function(callback) {
      this.callback = callback;
    },

    complete: function(status) {
      this.callback(status);
    }
  };

  return Mock;

}());

