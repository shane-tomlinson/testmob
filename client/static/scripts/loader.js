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

    try {
      var data = JSON.parse(event.originalEvent.data);
      if(data.msg === "suite_complete") {
        iframe.parentNode.removeChild(iframe);
      }
      cb(null, data);
    } catch(e) {
      cb(e, null);
    }
  });

  return {
    load: load
  };


}());
