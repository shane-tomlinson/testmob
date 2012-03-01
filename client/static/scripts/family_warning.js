/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(function() {
  if(!localStorage.last_visit) {
    $("#family_warning").slideDown();
  }

  localStorage.last_visit = new Date().getTime();
  $("#hide_family_warning").click(function(event) {
    event.preventDefault();
    $("#family_warning").slideUp();
  });
});
