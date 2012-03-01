/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs"),
      path = require("path");

var commands = {};

exports.init = function(cb) {
  // Make the commands list by loading up all the files in the commands
  // directory.  Require each file and place the included file into the
  // commands list.
  var root = path.join(__dirname, "commands");

  fs.readdir(root, function(err, files) {
    if(err) {
      cb(err, null);
    }
    else {
      for(var i = 0, fileName; fileName = files[i]; ++i) {
        // only load js files.
        if(fileName.search(/\.js$/) > -1) {
          var filePath = path.join(root, fileName),
              command = require(filePath),
              commandName = fileName.replace(/\.js$/, "");

          commands[commandName] = command;
        }
      }

      cb(err, files);
    }
  });
};

exports.get = function(name) {
  return commands[name];
};

exports.forEach = function(cb, context) {
  for(var key in commands) {
    cb.call(context || null, commands[key]);
  }
};
