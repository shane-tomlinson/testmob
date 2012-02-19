/*globals TestMob: true, AFrame: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Boss = (function() {
  var socket,
      tm = TestMob,
      dom = tm.DOM,
      Test = tm.Models.Test,
      TestView = tm.Modules.Test,
      renderer = tm.Renderer,
      models,
      list;

  function init(config) {
    socket = config.socket;

    models = AFrame.CollectionHash.create({
      plugins: [[AFrame.CollectionPluginModel, {
        schema: Test
      }]]
    });

    list = AFrame.List.create({
      target: "#results",
      renderItem: function(model, index) {
        var data = model.toObject(),
            selector = "#" + data.test_id,
            createContainer = dom.createElement("div");

        dom.appendTo(createContainer, "body");
        renderer.render(createContainer, "results", data);

        var el = $(selector);
        dom.removeElement(createContainer);

        return el;
      },
      plugins: [[AFrame.ListPluginBindToCollection, {
        collection: models
      }], [AFrame.ListPluginFormRow, {
        formFactory: function(rowElement, data) {
          var form = TestView.create({
            target: rowElement,
            data: data
          });
          return form;
        }
      }]
      ]
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
      return "runner" + data.runner_id;
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


  return {
    init: init
  };
}());
