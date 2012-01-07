$(function() {
  "use strict";

  var testWindow,
      resultTemplate = new EJS({ url: "/templates/testrunner_results.ejs" }),
      socket = io.connect('http://testmob.org'),
      currTestID = 0,
      last_send;

  function printResults(data) {
    try {
      var html = resultTemplate.render(data);

      if($("#results").find("#" + data.test_id).length) {
        $("#" + data.test_id).replaceWith(html);
      }
      else {
        $(html).appendTo("#results");
      }
    } catch(e) {
      console.log("template error(" + data.msg + "): " + e);
    }
  }


  function start_suite(data, fn) {
    data = $.extend({
      msg: "start_suite",
      test_id: currTestID,
      email: data.email || "",
      passed: 0,
      failed: 0,
      total: 0,
      runtime: 0,
      start_time: (new Date()).getTime(),
      userAgent: navigator.userAgent
    }, data);
    currTestID++;

    printResults(data);

    last_send = null;
    socket.emit("suite_start", data);

    TestSwarm.Loader.load(data, loader_result.bind(null, data));
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
      printResults(start_data);
      socket.emit(msg, start_data);
      last_send = now;
    }
  }

  function shouldUpdate(msg, now) {
    return (msg === "suite_complete" || !last_send || ((now - last_send) > 2500));
  }

  socket.on('start_suite', start_suite);
});

