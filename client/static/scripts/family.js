$(function() {
  "use strict";

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
