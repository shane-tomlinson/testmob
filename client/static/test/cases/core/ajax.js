(function() {
  "use strict";

  var tm = TestMob,
      ajax = tm.Ajax,
      xhr = tm.Mocks.xhr;

  module("core/ajax", {
    setup: function() {
      xhr.useResult("success");

      ajax.init({
        xhr: xhr
      });
    },

    teardown: function() {
      ajax.reset();
    }
  });


  asyncTest("get failure - error value, null response", function() {
    xhr.useResult("ajaxError");

    ajax.get("/sample", {}, function(err, resp) {
      equal(err.status, 400, "error status code given");
      equal(err.responseText, "response text", "response text given");
      equal(null, resp, "response is null");
      start();
    });
  });

  asyncTest("get success - null error value, JSON response", function() {
    ajax.get("/sample", {}, function(err, resp) {
      equal(err, null, "no error passed");
      equal(resp.success, true, "response decoded, good");
      start();
    });
  });

  asyncTest("get with data success - null error value, JSON response", function() {
    ajax.get("/sample", {sample: "data"}, function(err, resp) {
      equal(err, null, "no error passed");
      equal(resp.success, true, "response decoded, good");
      start();
    });
  });

  asyncTest("post failure - error value, null response", function() {
    xhr.useResult("ajaxError");

    ajax.post("/sample", {}, function(err, resp) {
      equal(err.status, 400, "error status code given");
      equal(err.responseText, "response text", "response text given");
      equal(null, resp, "response is null");
      start();
    });
  });

  asyncTest("post success - null error value, JSON response", function() {
    ajax.post("/sample", {}, function(err, resp) {
      equal(err, null, "no error passed");
      equal(resp.success, true, "response decoded, good");
      start();
    });
  });

  asyncTest("post with data success - null error value, JSON response", function() {
    ajax.post("/sample", {sample: "data"}, function(err, resp) {
      equal(err, null, "no error passed");
      equal(resp.success, true, "response decoded, good");
      start();
    });
  });


}());

