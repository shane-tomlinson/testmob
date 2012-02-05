TestMob.Ajax = (function() {
  "use strict";

  var xhr = $,
      complete = TestMob.Helpers.complete;

  function init(options) {
    if(options.xhr) xhr = options.xhr;
  }

  function reset() {
    xhr = $;
  }

  function get(url, data, callback) {
    var extendedURL = url;

    if(data) {
      var parts = [];
      for(var key in data) {
        parts.push(key + "=" + encodeURIComponent(data[key]));
      }

      if(parts.length) {
        extendedURL += "?" + parts.join("&");
      }
    }

    xhr.ajax({
      type: "GET",
      url: extendedURL,
      success: function(resp) {
        complete(callback, null, resp);
      },
      error: function(resp, xhr, textResponse) {
        complete(callback, resp, null);
      }
    });
  }

  function post(url, data, callback) {
    xhr.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function(resp) {
        complete(callback, null, resp);
      },
      error: function(resp, xhr, textResponse) {
        complete(callback, resp, null);
      }
    });

  }

  return {
    init: init,
    reset: reset,
    get: get,
    post: post
  }
}());

