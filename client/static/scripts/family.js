/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(function() {
  "use strict";

  // Only start the family related stuff if the user is at the /family URL.
  if(document.location.href.indexOf("family") == -1) return;

  var tm = TestMob,
      family_name = document.location.href.replace("http://testmob.org/family/", ""),
      socket = TestMob.XHREvents.create({});

  socket.start({
    io: io,
    url: "http://testmob.org/" + family_name
  });

  tm.Boss.init({ socket: socket });
  tm.JobRunner.init({ socket: socket });
});
