/*jshint browsers:true, forin: true, laxbreak: true */
/* Original code from Mozilla's BrowserID */

/*global start: true, stop: true, module: true, ok: true, equal: true, TestMob: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Mocks.xhr = (function() {

  /**
   * This is the results table, the keys are the request type, url, and
   * a "selector" for testing.  The right is the expected return value, already
   * decoded.  If a result is "undefined", the request's error handler will be
   * called.
   */
  var xhr = {
    results: {
      "get /sample success": { success: true },
      "get /sample?sample=data success": { success: true },
      "post /sample success": { success: true },
      "post /wsapi/login success": { success: true, email: "testuser@testuser.com" },
      "post /wsapi/logout success": { success: true }
    },

    useResult: function(result) {
      xhr.resultType = result;
    },

    getLastRequest: function() {
      return this.req;
    },

    ajax: function(obj) {
      //console.log("ajax request");
      var type = obj.type ? obj.type.toLowerCase() : "get";

      var req = this.req = {
        type: type,
        url: obj.url,
        data: obj.data
      };


      var resultType = xhr.resultType;

      var resName = req.type + " " + req.url + " " + resultType;

      var result = xhr.results[resName];

      var type = typeof result;
      if(!(type == "number" || type == "undefined")) {
        if(obj.success) {
          obj.success(result);
        }
      }
      else if (obj.error) {
        // Invalid result - either invalid URL, invalid GET/POST or
        // invalid resultType
        obj.error({ status: result || 400, responseText: "response text" }, "errorStatus", "errorThrown");
      }
    }
  };


  return xhr;
}());


