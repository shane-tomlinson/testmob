(function() {
  "use strict";

  var tm = TestMob,
      modules = tm.Modules,
      Auth = modules.Authentication,
      BrowserID = tm.Mocks.BrowserID,
      ajax = tm.Ajax,
      xhr = tm.Mocks.xhr,
      service;

  module("authentication", {
    setup: function() {
      ajax.init({ xhr: xhr });
    },

    teardown: function() {
      BrowserID.reset();
      ajax.reset();
      if(service) {
        service.destroy();
        service = null;
      }
    }
  });

  function createService(options, complete) {
    var service = Auth.create();

    options = $.extend(options || {}, {
      browserid: BrowserID
    });
    service.start(options, complete);
    return service;
  }

  asyncTest("start with user authenticated to BrowserID - show signout", function() {
    service = createService({}, function(err, status) {
      ok(false, "write some tests");
      start();
    });
  });

  asyncTest("start with user not authenticated to BrowserID - show signin", function() {
    service = createService({}, function() {
      ok(false, "write some tests");

      start();
    });
  });

  asyncTest("signin - signs user in with browserid, updates the display", function() {
    service = createService({}, function() {
      service.signin(function() {

        start();
      });

    });
  });


}());
