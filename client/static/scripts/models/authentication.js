TestMob.Models.Authentication = (function() {
  "use strict";

  var authenticated,
      email;

  function login(assertion, callback) {
    ajax.post("/wsapi/login", { assertion: assertion }, callback);
  }

  function logout(callback) {
    ajax.post("/wsapi/logout", {}, callback);
  }

  var Model;

  return Model;

}());

