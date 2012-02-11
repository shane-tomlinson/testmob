/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Boss = (function() {
  var socket,
      tm = TestMob,
      models = {},
      BossTest = tm.Models.Test;

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

    function modelID(data) {
      return "runner" + data.runner_id;
    }


    socket.on("suite_start", function(data) {
      data.id = modelID(data);
      var model = BossTest.create({
        data: data
      });

      models[data.id] = model;

      var view = TestMob.Modules.Test.create();
      view.start({
        model: model,
        template: "results"
      });
    });

    socket.on("test_done", function(data) {
      var model = models[modelID(data)];
      model.set(data);
    });

    socket.on("suite_complete", function(data) {
      data.complete = true;
      var model = models[modelID(data)];
      model.set(data);
    });
  }


  return {
    init: init
  };
}());
