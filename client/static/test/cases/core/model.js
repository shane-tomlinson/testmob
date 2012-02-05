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

  test("toObject - convert data to an object with keys/values", function() {
    var obj = model.toObject();

    equal(obj.field, "value", "correct value for field");
  });

  asyncTest("set with object instead of individual value - trigger set_complete",
  function() {
    model.bindEvent("set_complete", function() {
      equal(model.get('key'), "value", "correct value set");
      start();
    });

    model.set({
      key: "value"
    });
  });
}());
