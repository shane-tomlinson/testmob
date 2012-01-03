(function() {
  "use strict";
  var results,
      callback;

  QUnit.done = function(info) {
    /*
    if(callback)
      callback(info);
    results = info;
*/
    try {
      window.parent.postMessage(JSON.stringify(info), "*");
      //window.top.postMessage(JSON.stringify(info), "*");
    } catch(e) {}
  };

}());

