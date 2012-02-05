TestMob.Models.Authentication = (function() {
  "use strict";

  var tm = TestMob,
      ajax = tm.Ajax,
      complete = tm.Helpers.complete,
      sc,
      browserid;

  function authenticate(assertion, callback) {
    var self=this;
    ajax.post("/wsapi/login", { assertion: assertion }, function(err, resp) {
      if(err) {
        // XXX handle error;
      }
      else {
        self.set("authenticated", resp.success);
        self.set("email", resp.success ? resp.email : "");
        complete(callback, null, resp.success);
      }
    });
  }

  function signin(callback) {
    var self=this;
    browserid.get(function(assertion) {
      if(assertion) {
        authenticate.call(self, assertion, callback);
      }
      else {
        // XXX handle error;
      }
    });
  }

  function signout(callback) {
    var self=this;
    ajax.post("/wsapi/logout", {}, function(err, resp) {
      if(err) {
        // XXX handle error;
      }
      else {
        browserid.logout(function() {
          self.set("authenticated", !resp.success);
          complete(callback, null, resp.success);
        });
      }
    });
  }

  var Model = TestMob.Model.extend({
    schema: {
      authenticated: { type: "boolean", def: false },
      email: { type: "string", def: undefined }
    },
    init: function(config) {
      browserid = config.browserid || navigator.id;

      sc.init.call(this, config);
    },

    signin: signin,
    signout: signout
  });

  sc = Model.sc;

  return Model;

}());

