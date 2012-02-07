/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.JobRunner = (function() {
  "use strict";

  var testWindow,
      currTestID = 0,
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
      msg: "start_suite",
      test_id: currTestID,
      start_time: (new Date()).getTime(),
      userAgent: navigator.userAgent
    }, data);

    model = TestMob.Models.Test.create({
      data: data
    });

    view = TestMob.Modules.Test.create();
    view.start({
      model: model
    });

    currTestID++;

    last_send = null;
    socket.emit("suite_start", data);

    TestMob.JobLoader.load(data, loader_result.bind(null, data));
  }

  function loader_result(start_data, err, info) {
    if(err) {
      console.log(err);
      return;
    }

    var data = info.data,
        msg = info.msg,
        now = (new Date()).getTime();

    if(msg === "test_done") {
      start_data = $.extend(start_data, {
        total: start_data.total + data.total,
        passed: start_data.passed + data.passed,
        failed: start_data.failed + data.failed,
        runtime: now - start_data.start_time,
        msg: msg
      });
    }
    else {
      start_data = $.extend(start_data, data, {
        msg: msg
      });
    }

    if(shouldUpdate(msg, now)) {
      model.set(start_data);
      socket.emit(msg, start_data);
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

