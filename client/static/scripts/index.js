$(function() {
    "use strict";

    var socket;
    socket = io.connect('http://192.168.1.88:3000');

    document.location.hash="";

    $("form").bind("submit", function(event) {
      event.preventDefault();

      var url = $("#url").val().trim();
      socket.emit('request_start_test', { url: url });
    });

    var resultTemplate = new EJS({ url: "/templates/results.ejs" });
    var result = 1;
    socket.on("test_start", function(data) {
      data.id = "runner" + data.runner_id;
      data.complete = false;
      var html = resultTemplate.render(data);
      $(html).appendTo("#results");
    });

    socket.on("test_complete", function(data) {
      data.id = "runner" + data.runner_id;
      data.complete = true;
      var html = resultTemplate.render(data);
      $("#" + data.id).replaceWith(html);
      result++;
    });

});
