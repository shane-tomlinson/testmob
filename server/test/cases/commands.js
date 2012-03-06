const assert = require("assert"),
      commands = require("../../commands");

describe("commands.init", function() {
  it("should read all files in the directory", function(done) {
    commands.init(function(err, files) {
      assert.ok(files.length, "at least one command added");

      var command = commands.get("suite_start");
      assert.ok(command, "can get known command");
      done();
    });
  });
});

describe("commands.forEach", function() {
  it("should iterate through each item in the list", function(done) {
    commands.init(function(err, files) {
      var count = 0;
      commands.forEach(function(item, index) {
        count++;
      });
      assert.ok(count, count + "command(s) iterated through");
      done();
    });
  });
});

