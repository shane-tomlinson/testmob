(function() {
  "use strict";

  var model;

  module("core/model", {
    setup: function() {
      model = createModel();
    },

    teardown: function() {
      model.teardown();
    }
  });

  function createModel() {
    var mod = TestMob.Model.create({
      schema: {
        field: { type: "text" }
      },
      data: {
        field: "value"
      }
    });
    return mod;
  }

  test("can create with initial data and get", function() {
    equal(model.get("field"), "value", "correct value set");
  });

  test("toObject converts data to an object with keys/values", function() {
    var obj = model.toObject();

    equal(obj.field, "value", "correct value for field");
  });
}());
