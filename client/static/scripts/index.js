$(function() {
  "use strict";

  var socket;
  socket = io.connect('testmob.org');

  document.location.hash="";

  $("#url").val(localStorage.url || "");

  $("form").bind("submit", function(event) {
    event.preventDefault();

    var url = $("#url").val().trim();
    if(url) {
      localStorage.url = url;
      socket.emit('request_start_test', { url: url });
    }
  });

  var resultTemplate = new EJS({ url: "/templates/results.ejs" });
  var result = 1;

  socket.on("test_start", function(data) {
    data.id = "runner" + data.runner_id;
    data.complete = false;
    data.email = data.email || "";
    var html = resultTemplate.render(data);
    $(html).appendTo("#results");
  });

  socket.on("test_complete", function(data) {
    data.id = "runner" + data.runner_id;
    data.complete = true;
    data.email = data.email || "";
    var html = resultTemplate.render(data);
    $("#" + data.id).replaceWith(html);
    result++;
  });
});
