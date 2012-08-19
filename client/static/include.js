/*global QUnit: true */
(function() {
  "use strict";
  var results,
      callback;

  function sendMessage(msg, data) {
    var packet = {
      msg: msg,
      data: data
    };

    try {
      if(window.parent !== window) {
        window.parent.postMessage(JSON.stringify(packet), "https://testmob.org");
      }
    } catch(e) {}
  }

  var moduleName;

  var __moduleStart = QUnit.moduleStart;
  QUnit.moduleStart = function(info) {
    moduleName = info.name;
    if(__moduleStart) __moduleStart.call(QUnit, info);
  };

  var messages = {};
  var __testDone = QUnit.testDone;
  QUnit.testDone = function(info) {
    info.name = moduleName + ": " + info.name;
    for(var key in messages) {
      info[key] = messages[key];
    }
    messages = {};
    sendMessage("test_done", info);
    if(__testDone) __testDone.call(QUnit, info);
  };

  var __done = QUnit.done;
  QUnit.done = function(info) {
    sendMessage("suite_complete", info);
    if(__done) __done.call(QUnit, info);
  };

  window.console = window.console || {};

  var funcNames = ["log", "warn", "error"];
  var decorated = {};

  for(var i = 0, len = funcNames.length; i < len; i++) {
    var funcName = funcNames[i];
    decorated[funcName] = console[funcName];
    console[funcName] = consoleDecorator(funcName);
  }

  function consoleDecorator(funcName) {
    return function(msg) {
      messages[funcName] = messages[funcName] || [];
      messages[funcName].push(msg);
      if(decorated[funcName]) decorated[funcName].call(console, msg);
    };
  }
}());

