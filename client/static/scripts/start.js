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
      AuthView = modules.Authentication,
      Family = modules.Family,
      Associate = modules.Associate,
      Boss = modules.Boss;


  var email = $("#email").text();
  tm.authModel = AuthModel.create({
    data: {
      authenticated: !!email,
      email: email
    }
  });

  moduleManager.register("associate", Associate);
  moduleManager.register("boss", Boss);

  moduleManager.register("authentication", AuthView);
  moduleManager.start("authentication", { model: tm.authModel });

  moduleManager.register("family", Family);
  moduleManager.start("family", { authModel: tm.authModel });

});

