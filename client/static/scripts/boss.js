/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Boss = (function() {
  var socket;

  function init(config) {
    socket = config.socket;

    $("#url").val(localStorage.url || "");
    $("form").bind("submit", function(event) {
      event.preventDefault();

      var url = $("#url").val().trim();
      if(url) {
        localStorage.url = url;
        socket.emit('request_start_suite', { url: url });
      }
    });

    var resultTemplate = new EJS({ url: "/templates/results.ejs" });
    var result = 1;

    socket.on("suite_start", function(data) {
      data.id = "runner" + data.runner_id;
      data.complete = false;
      data.email = data.email || "";
      var html = resultTemplate.render(data);
      $(html).appendTo("#results");
    });

    socket.on("test_done", function(data) {
      data.id = "runner" + data.runner_id;
      data.complete = false;
      data.email = data.email || "";
      var html = resultTemplate.render(data);
      $("#" + data.id).replaceWith(html);
    });

    socket.on("suite_complete", function(data) {
      data.id = "runner" + data.runner_id;
      data.complete = true;
      data.email = data.email || "";
      var html = resultTemplate.render(data);
      $("#" + data.id).replaceWith(html);
      result++;
    });
  }


  return {
    init: init
  };
}());
