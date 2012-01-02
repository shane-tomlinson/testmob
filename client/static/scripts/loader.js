TestSwarm.Loader = (function() {
  "use strict";

  function load(data, callback) {
    var testWindow = WinChan.open(data.url, "http://testmob.org/relay.html", "", {}, function(err, data) {
      testWindow.close();
      callback(err, data);
    });
  }

  return {
    load: load
  };


}());
