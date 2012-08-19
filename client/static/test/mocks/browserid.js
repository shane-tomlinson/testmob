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

    watch: function(options) {
      this.onlogin = options.onlogin;
      this.onlogout = options.onlogout;
    },

    request: function(options) {

    },

    logout: function(callback) {
      this.onlogout();
    },

    completeLogin: function(status) {
      this.onlogin(status);
    },

    completeLogout: function(status) {
      this.onlogout(status);
    }
  };

  return Mock;

}());

