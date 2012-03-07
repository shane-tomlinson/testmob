/*globals TestMob: true, AFrame: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Modules.Boss = (function() {
  var socket,
      tm = TestMob,
      mediator = tm.Mediator,
      models,
      list;

  function getModel(data) {
    var model = models && models.get(modelID(data));
    return model;
  }

  function modelID(data) {
    return "runner:" + data.runner_id + "." + data.test_id;
  }

  var Module = tm.Module.extend({
    startTest: function(event) {
      event.preventDefault();

      var url = $("#url").val().trim();
      if(url) {
        // XXX - We should keep a list of all the models collections, one
        // collection per test suite, when a result comes in, search all
        // collections for the model and then update appropariately.
        models = tm.ModelsFactory.create({ constructor: tm.Models.Test });
        list = tm.ViewsFactory.create({
          list_template: "test_results",
          result_template: "boss_result",
          models: models,
          url: url
        });

        localStorage.url = url;
        socket.emit('request_start_suite', { url: url });
      }
    },

    start: function(config) {
      socket = config.socket;

      $("#url").val(localStorage.url || "");
      $("form").bind("submit", this.startTest.bind(this));

      mediator.subscribe("stop_suite", function(msg, data) {
        var model = getModel(data);
        if(model) {
          model.set("force_stopped", true);
          model.set("complete", true);
          model.triggerEvent("set_complete");
        }
        var emit_data = { test_id: data.test_id, target_id: data.runner_id };
        socket.emit("stop_suite", emit_data);
      });

      socket.on("suite_start", function(data) {
        data.cid = data.id = modelID(data);
        var cid = models.insert(data);
      });

      socket.on("test_done", function(data) {
        var model = getModel(data);
        if(model) {
          model.set(data);
        }
      });

      socket.on("suite_complete", function(data) {
        data.complete = true;
        var model = getModel(data);
        if(model) {
          model.set(data);
        }
      });
    }
  });



  return Module;

}());
