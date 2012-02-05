(function() {
  "use strict";
  var results,
      callback;

  function sendMessage(msg, data) {
    var packet = {
      msg: msg,
      data: data
    };

    try {
      if(window.parent !== window) {
        window.parent.postMessage(JSON.stringify(packet), "http://testmob.org");
      }
    } catch(e) {}
  }

  var origTestDone = QUnit.testDone;
  QUnit.testDone = function(info) {
    sendMessage("test_done", info);
    if(origTestDone) origTestDone(info);
  };

  var origDone = QUnit.done;
  QUnit.done = function(info) {
    sendMessage("suite_complete", info);
    if(origDone) origDone(info);
  };

}());
