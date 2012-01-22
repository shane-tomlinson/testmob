$(function() {
  "use strict";

  var tm = TestMob,
      models = tm.Models,
      AuthModel = models.Authentication,
      modules = tm.Modules,
      moduleManager = tm.moduleManager,
      AuthView = modules.Authentication;


  var authModel = AuthModel.create({});

  moduleManager.register("authentication", AuthView);
  moduleManager.start("authentication", { model: authModel });
});

