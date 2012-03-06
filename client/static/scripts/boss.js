/*globals TestMob: true, AFrame: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Modules.Boss = (function() {
  var socket,
      tm = TestMob,
      models,
      list;

  var Module = tm.Module.extend({
    start: function(config) {
      socket = config.socket;

      models = tm.ModelsFactory.create({ constructor: tm.Models.Test });
      list = tm.ViewsFactory.create({
        template: "boss_results",
        models: models
      });

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
        return "runner:" + data.runner_id + "." + data.test_id;
      }

      socket.on("suite_start", function(data) {
        data.cid = data.id = modelID(data);
        var cid = models.insert(data);
      });

      socket.on("test_done", function(data) {
        var model = models.get(modelID(data));
        model.set(data);
      });

      socket.on("suite_complete", function(data) {
        data.complete = true;
        var model = models.get(modelID(data));
        model.set(data);
      });
    }
  });

  return Module;

}());
