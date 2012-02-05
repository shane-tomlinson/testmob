TestMob.Helpers = (function() {
  "use strict";

  function cancelEvent(callback) {
    return function(event) {
      event.preventDefault();
      callback && callback.call(this);
    };
  }

  function complete(callback) {
    var args = [].slice.call(arguments, 1);
    callback && callback.apply(null, args);
  }

  return {
    cancelEvent: cancelEvent,
    complete: complete
  }


}());

