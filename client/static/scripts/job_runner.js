/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.JobRunner = (function() {
  "use strict";

  var testWindow,
      last_send,
      socket,
      model,
      view;

  function init(config) {
    socket = config.socket;
    socket.on('start_suite', start_suite);
  }

  function start_suite(data, fn) {
    data = $.extend({
      msg: "start_suite"
    }, data);

    model = TestMob.Models.ClientTest.create({
      data: data
    });

    /*
    view = TestMob.Modules.Test.create();
    view.start({
      model: model
    });
    */

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


  return {
    init: init
  };
}());

