(function() {
  "use strict";
  var results,
      callback;

  var WinChan = (function() {
    var RELAY_FRAME_NAME = "__winchan_relay_frame";

    // a portable addListener implementation
    function addListener(w, event, cb) {
      if(w.attachEvent) w.attachEvent('on' + event, cb);
      else if (w.addEventListener) w.addEventListener(event, cb, false);
    }

    // a portable removeListener implementation
    function removeListener(w, event, cb) {
      if(w.detachEvent) w.detachEvent('on' + event, cb);
      else if (w.removeEventListener) w.removeEventListener(event, cb, false);
    }

    // checking for IE8 or above
    function isInternetExplorer() {
      var rv = -1; // Return value assumes failure.
      if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
          rv = parseFloat(RegExp.$1);
      }
      return rv >= 8;
    }

    // checking Mobile Firefox (Fennec)
    function isFennec() {
      try {
        return (navigator.userAgent.indexOf('Fennec/') != -1);
      } catch(e) {};
      return false;
    }

    // feature checking to see if this platform is supported at all
    function isSupported() {
      return (window.JSON && window.JSON.stringify &&
              window.JSON.parse && window.postMessage);
    }

    // given a URL, extract the origin
    function extractOrigin(url) {
      if (!/^https?:\/\//.test(url)) url = window.location.href;
      var m = /^(https?:\/\/[-_a-zA-Z\.0-9:]+)/.exec(url);
      if (m) return m[1];
      return url;
    }

    // find the relay iframe in the opener
    function findRelay() {
      var loc = window.location;
      var frames = window.opener.frames;
      var origin = loc.protocol + '//' + loc.host;
      for (i = frames.length - 1; i >= 0; i++) {
        try {
          if (frames[i].location.href.indexOf(origin) === 0 &&
              frames[i].name === RELAY_FRAME_NAME)
          {
            return frames[i];
          }
        } catch(e) { }
      }
      return;
    }

    var isIE = isInternetExplorer();

    if (isSupported()) {
      /*  General flow:
       *                  0. user clicks
       *  (IE SPECIFIC)   1. caller adds relay iframe (served from trusted domain) to DOM
       *                  2. caller opens window (with content from trusted domain)
       *                  3. window on opening adds a listener to 'message'
       *  (IE SPECIFIC)   4. window on opening finds iframe
       *                  5. window checks if iframe is "loaded" - has a 'doPost' function yet
       *  (IE SPECIFIC5)  5a. if iframe.doPost exists, window uses it to send ready event to caller
       *  (IE SPECIFIC5)  5b. if iframe.doPost doesn't exist, window waits for frame ready
       *  (IE SPECIFIC5)  5bi. once ready, window calls iframe.doPost to send ready event
       *                  6. caller upon reciept of 'ready', sends args
       */
      return {
        open: function(opts, cb) {
          if (!cb) throw "missing required callback argument";

          // test required options
          var err;
          if (!opts.url) err = "missing required 'url' parameter";
          if (!opts.relay_url) err = "missing required 'relay_url' parameter";
          if (err) setTimeout(function() { cb(err); }, 0);

          // supply default options
          if (!opts.window_features || isFennec()) opts.window_features = undefined;

          // opts.params may be undefined

          var iframe;

          // sanity check, are url and relay_url the same origin?
          var origin = extractOrigin(opts.url);
          if (origin !== extractOrigin(opts.relay_url)) {
            return setTimeout(function() {
              cb('invalid arguments: origin of url and relay_url must match');
            }, 0);
          }

          var messageTarget;

          if (isIE) {
            // first we need to add a "relay" iframe to the document that's served
            // from the target domain.  We can postmessage into a iframe, but not a
            // window
            iframe = document.createElement("iframe");
            // iframe.setAttribute('name', framename);
            iframe.setAttribute('src', opts.relay_url);
            iframe.style.display = "none";
            iframe.setAttribute('name', RELAY_FRAME_NAME);
            document.body.appendChild(iframe)
            messageTarget = iframe.contentWindow;
          }

          var w = window.open(opts.url, null, opts.window_features);

          if (!messageTarget) messageTarget = w;

          var req = JSON.stringify({a: 'request', d: opts.params});

          // cleanup on unload
          function cleanup() {
            if (iframe) document.body.removeChild(iframe);
            iframe = undefined;
            if (w) w.close();
            w = undefined;
          }

          addListener(window, 'unload', cleanup);

          function onMessage(e) {
            try {
              var d = JSON.parse(e.data);
              if (d.a === 'ready') messageTarget.postMessage(req, origin);
              else if (d.a === 'error') cb(d.d);
              else if (d.a === 'response') {
                removeListener(window, 'message', onMessage);
                removeListener(window, 'unload', cleanup);
                cleanup();
                cb(null, d.d);
              }
            } catch(e) { }
          };

          addListener(window, 'message', onMessage);

          return {
            close: cleanup,
            focus: function() {
              if (w) w.focus();
            }
          };
        },
        onOpen: function(cb) {
          var o = "*";
          var msgTarget = isIE ? findRelay() : window.opener;
          if (!msgTarget) throw "can't find relay frame";
          function doPost(msg) {
            msg = JSON.stringify(msg);
            if (isIE) msgTarget.doPost(msg, o);
            else msgTarget.postMessage(msg, o);
          }

          function onMessage(e) {
            // only one message gets through
            removeListener(window, 'message', onMessage);
            var d;
            o = e.origin;
            try {
              d = JSON.parse(e.data);
            } catch(e) { }
            if (cb) {
              // this setTimeout is critically important for IE8 -
              // in ie8 sometimes addListener for 'message' can synchronously
              // cause your callback to be invoked.  awesome.
              setTimeout(function() {
                cb(o, d.d, function(r) {
                  cb = undefined;
                  doPost({a: 'response', d: r});
                });
              }, 0);
            }
          }
          addListener(isIE ? msgTarget : window, 'message', onMessage);

          // we cannot post to our parent that we're ready before the iframe
          // is loaded. (IE specific possible failure)
          try {
            doPost({a: "ready"});
          } catch(e) {
            // this code should never be exectued outside IE
            addListener(msgTarget, 'load', function(e) {
              doPost({a: "ready"});
            });
          }

          // if window is unloaded and the client hasn't called cb, it's an error
          var onUnload = function() {
            if (cb) doPost({ a: 'error', d: 'client closed window' });
            cb = undefined;
            // explicitly close the window, in case the client is trying to reload or nav
            try { window.close(); } catch (e) { };
          };
          addListener(window, 'unload', onUnload);
          return {
            detach: function() {
              removeListener(window, 'unload', onUnload);
            }
          };
        }
      }
    } else {
      return {
        open: function(url, winopts, arg, cb) {
          setTimeout(function() { cb("unsupported browser"); }, 0);
        },
        onOpen: function(cb) {
          setTimeout(function() { cb("unsupported browser"); }, 0);
        }
      };
    }
  })();

  QUnit.done = function(info) {
    if(callback)
      callback(info);

    results = info;
  };

  var channel = WinChan.onOpen(function(origin, args, cb) {
    if(results) {
      console.log(results);
      cb(results);
    }
    else {
      callback = cb;
    }
  });
}());

