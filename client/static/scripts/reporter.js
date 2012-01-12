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

  /*
  QUnit.testStart = function(info) {
    sendMessage("test_start", info);
  };
*/
  QUnit.testDone = function(info) {
    sendMessage("test_done", info);
  };

  QUnit.done = function(info) {
    sendMessage("suite_complete", info);
  };

}());

