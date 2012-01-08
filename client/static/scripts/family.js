$(function() {
  "use strict";

  var family_name = document.location.href.replace("http://testmob.org/family/", "");
  var socket = io.connect('http://testmob.org/' + family_name);

  TestMob.Boss.init({ socket: socket });
  TestMob.JobRunner.init({ socket: socket });

});
