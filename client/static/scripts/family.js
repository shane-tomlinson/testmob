/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(function() {
  "use strict";

  // Only start the family related stuff if the user is at the /family URL.
  if(document.location.href.indexOf("family") == -1) return;

  var family_name = document.location.href.replace("http://testmob.org/family/", "");
  var socket = io.connect('http://testmob.org/' + family_name);

  TestMob.Boss.init({ socket: socket });
  TestMob.JobRunner.init({ socket: socket });


  if(!localStorage.last_visit) {
    $("#family_warning").slideDown();
  }

  localStorage.last_visit = new Date().getTime();
  $("#hide_family_warning").click(function(event) {
    event.preventDefault();
    $("#family_warning").slideUp();
  });
});
