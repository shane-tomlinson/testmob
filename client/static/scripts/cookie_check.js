/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Modules.CookieCheck = (function(){
  "use strict";

  var tm = TestMob,
      renderer = tm.Renderer;

  function checkCookies() {
    var enabled;
    // set a test cookie with a duration of 1 second.
    // NOTE - The Android 3.3 default browser will still pass this.
    // http://stackoverflow.com/questions/8509387/android-browser-not-respecting-cookies-disabled/9264996#9264996
    document.cookie = "test=true; max-age=1";
    enabled = document.cookie.indexOf("test") > -1;

    if(enabled) {
      try {
        localStorage.cookie_test = "true";
        enabled = localStorage.cookie_test === "true";
        localStorage.removeItem("cookie_test");
      } catch(e) {
        enabled = false;
      }
    }

    return enabled;
  }

  var Module = tm.Module.extend({
    start: function(config) {
      var self=this;
      self.explicit_status = config.explicit_status;

      Module.sc.start.call(self, config);

      this.checkCookies(config.ready);
    },

    checkCookies: function(callback) {
      var self = this,
          enabled;

      if(typeof self.explicit_status !== "undefined") {
        enabled = self.explicit_status;
      }
      else {
        enabled = checkCookies();
      }

      if(!enabled) {
        self.cookieFailure();
      }

      callback(null, enabled);
    },

    cookieFailure: function() {
      renderer.append("body", "error", {
        title: "Cookies are disabled!",
        message: "We are sorry, but cookies must be enabled to run tests.  Please enable your browser's cookies and try again"
      });
    }
  });

  return Module;
}());

