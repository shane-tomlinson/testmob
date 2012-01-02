TestSwarm.Loader = (function() {
  "use strict";

  var iframe,
      loadData,
      cb;

  function extractOrigin(url) {
    if (!/^https?:\/\//.test(url)) url = window.location.href;
    var m = /^(https?:\/\/[-_a-zA-Z\.0-9:]+)/.exec(url);
    if (m) return m[1];
    return url;
  }

  function load(data, callback) {
    /*
    var relay = extractOrigin(data.url) + "/relay";
    var testWindow = WinChan.open(data.url, relay, "width=800,height=500", {}, function(err, data) {
      testWindow.close();
      callback(err, data);
    });
    */

    loadData = data;
    cb = callback;

    iframe = document.createElement("iframe");
    iframe.setAttribute("src", data.url);
    iframe.setAttribute("class", "test_frame");

    document.body.appendChild(iframe);
  }

  $(window).bind("message", function(event) {
    if(!(loadData && event.originalEvent.origin === extractOrigin(loadData.url))) {
      return;
    }

    iframe.parentNode.removeChild(iframe);
    var data = JSON.parse(event.originalEvent.data);
    cb(null, data);
  });

  return {
    load: load
  };


}());
