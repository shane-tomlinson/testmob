/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

