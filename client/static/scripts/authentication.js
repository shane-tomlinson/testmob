TestMob.Modules.Authentication = (function() {
  "use strict";

  var tm = TestMob,
      dom = tm.dom,
      helpers = tm.Helpers,
      ajax = tm.Ajax,
      cancelEvent = helpers.cancelEvent,
      complete = helpers.complete,
      browserid,
      sc;

  /*
  var authenticationTemplate = new EJS({ url: "/templates/authentication.ejs" });
  */
  function updateDisplay(data) {
    data = data || {};
    var html = authenticationTemplate.render(data);
    $("#authentication").html(html);
    attachEvents();
  }

  function attachEvents() {
    var self=this;
    self.bind("#signin", "click", cancelEvent(signin));
    self.bind("#signout", "click", cancelEvent(signout));
  }

  function on_receive_assertion(assertion) {
    if(assertion !== null) {
      ajax.post("/wsapi/login", { assertion: assertion }, function(err, resp) {
        if(err) {

        }
        else {
          updateDisplay(resp);
        }
      });
    }
  }

  function signin(callback) {
    browserid.get(on_receive_assertion, {
      allowPersistent: true
    });
    complete(callback);
  }

  function signout(callback) {
    ajax.post("/wsapi/logout", {}, function(err, resp) {
      if(err) {

      }
      else {
        browserid.logout(function() {
          updateDisplay();
          complete(callback);
        });
      }
    });
  }

  function checkAuthentication() {
    if($("#signout").length === 0) {
      // try a silent assertion if there is no signout button.
      browserid.get(on_receive_assertion, {
        silent: true
      });
    }
  }

  var Module = TestMob.Module.extend({
    start: function(options, callback) {
      var self=this;

      self.checkRequired(options, "browserid");
      browserid = options.browserid;

      sc.start.call(self, options);

      checkAuthentication.call(self);
      attachEvents.call(self);

      complete(callback);
    }

    // BEGIN TESTING API
    ,
    signin: signin,
    signout: signout

    // END TESTING API
  });

  sc = Module.sc;

  return Module;


}());

