/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Modules.Associate = (function() {
  "use strict";

  var tm = TestMob,
      last_send,
      socket,
      models,
      list,
      model,
      view;

  function start_suite(data, fn) {
    models = tm.ModelsFactory.create({ constructor: TestMob.Models.AssociateTest });
    list = tm.ViewsFactory.create({
      list_template: "test_results",
      result_template: "associate_result",
      models: models,
      url: data.url || ""
    });

    data = $.extend({
      msg: "start_suite"
    }, data);

    var cid = models.insert(data);
    model = models.get(cid);

    last_send = null;
    socket.emit("suite_start", model.toObject());

    TestMob.JobLoader.load(data, loader_result);
  }

  function loader_result(err, info) {
    if(err) {
      console.log(err);
      return;
    }

    var data = info.data,
        msg = info.msg,
        now = (new Date()).getTime();

    if(msg === "test_done") {
      model.update(data);
    }
    else if(msg === "suite_complete") {
      model.complete();
    }

    if(shouldUpdate(msg, now)) {
      socket.emit(msg, model.toObject());
      last_send = now;
    }
  }

  function shouldUpdate(msg, now) {
    return (msg === "suite_complete" || !last_send || ((now - last_send) > 2500));
  }

  var Module = tm.Module.extend({
    start: function(config) {
      socket = config.socket;
      socket.on('start_suite', start_suite);

    }
  });

  return Module;
}());

