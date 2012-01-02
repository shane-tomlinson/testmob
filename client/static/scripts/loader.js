TestSwarm.Loader = (function() {
  "use strict";

  function extractOrigin(url) {
    if (!/^https?:\/\//.test(url)) url = window.location.href;
    var m = /^(https?:\/\/[-_a-zA-Z\.0-9:]+)/.exec(url);
    if (m) return m[1];
    return url;
  }

  function load(data, callback) {
    var relay = extractOrigin(data.url) + "/relay";
    var testWindow = WinChan.open(data.url, relay, "width=800,height=500", {}, function(err, data) {
      testWindow.close();
      callback(err, data);
    });
  }

  return {
    load: load
  };


}());
