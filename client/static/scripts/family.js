/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Modules.Family = (function(){
  "use strict";

  var tm = TestMob,
      XHREvents = tm.XHREvents,
      moduleManager = tm.moduleManager;

  var Module = tm.Module.extend({
    start: function(config) {
      // Only start the family related stuff if the user is at the /family URL.
      if(document.location.href.indexOf("family") == -1) return;

      moduleManager.start("cookie_check", { ready: function(err, cookiesEnabled) {
        if(err || !cookiesEnabled) return;

        var family_name = document.location.href.replace("https://testmob.org/family/", ""),
            xhrEvents = XHREvents.create({});

        xhrEvents.start({
          io: io,
          url: "https://testmob.org/" + family_name
        });

        config.authModel.bindField("email", function(event) {
          xhrEvents.setEmail(event.value);
        });

        moduleManager.start("associate", { xhrEvents: xhrEvents });
        moduleManager.start("boss", { xhrEvents: xhrEvents });
      } });
    }
  });

  return Module;

}());
