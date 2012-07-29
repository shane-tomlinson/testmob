/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Modules.Authentication = (function() {
  "use strict";

  var tm = TestMob,
      dom = tm.DOM,
      helpers = tm.Helpers,
      ajax = tm.Ajax,
      cancelEvent = helpers.cancelEvent,
      complete = helpers.complete,
      renderer = tm.Renderer,
      sc;

  function updateDisplay() {
    var self = this,
        data = self.model.toObject();
    self.unbindAll();
    renderer.render("#authentication", "authentication", data);
    attachEvents.call(self);
  }

  function attachEvents() {
    var self=this;
    self.bind("#signin", "click", cancelEvent(signin));
    self.bind("#signout", "click", cancelEvent(signout));
  }

  function signin(callback) {
    var self=this;
    self.model.signin(function(err, resp) {
      if(err) {
        // XXX do something here!
      }
      else {
        updateDisplay.call(self);
      }
      complete(callback, err, status);
    });
  }

  function signout(callback) {
    var self=this;
    self.model.signout(function(err, status) {
      if(err) {

      } else {
        updateDisplay.call(self);
      }
      complete(callback, err, status);
    });
  }

  var Module = TestMob.Module.extend({
    start: function(options, callback) {
      var self=this;

      self.checkRequired(options, "model");
      self.model = options.model;

      sc.start.call(self, options);
      updateDisplay.call(self);
      self.model.bindEvent("onSet-email", updateDisplay, self);
      complete(callback, self);
    }

    // BEGIN TESTING API
    ,
    signin: signin,
    signout: signout

    // END TESTING API
  });

  sc = Module.sc;

  return Module;


}());

