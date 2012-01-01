TestSwarm.Loader = (function() {
  "use strict";

  function load(data, callback) {
    var testWindow = WinChan.open(data.url, "http://192.168.1.88:10002/relay", "", {}, function(err, data) {
      testWindow.close();
      callback(err, data);
    });
  }

  return {
    load: load
  };


}());
