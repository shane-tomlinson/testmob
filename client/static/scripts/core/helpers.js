/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

