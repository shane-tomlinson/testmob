/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(function() {
  "use strict";

  var tm = TestMob,
      models = tm.Models,
      AuthModel = models.Authentication,
      modules = tm.Modules,
      moduleManager = tm.moduleManager,
      AuthView = modules.Authentication;


  var email = $("#email").text();
  var authModel = AuthModel.create({
    data: {
      authenticated: !!email,
      email: email
    }
  });

  moduleManager.register("authentication", AuthView);
  moduleManager.start("authentication", { model: authModel });
});

