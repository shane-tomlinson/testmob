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

