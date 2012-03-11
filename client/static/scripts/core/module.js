/*jshint browser:true, jQuery: true, forin: true, laxbreak:true */
/*global TestMob: true*/
/* Original code from Mozilla's BrowserID */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
TestMob.Modules = TestMob.Modules || {};
TestMob.Module = (function() {
"use strict";

  var ANIMATION_TIME = 250,
      tm = TestMob,
      dom = tm.DOM,
      mediator = tm.Mediator;

   function onSubmit(event) {
     event.stopPropagation();
     event.preventDefault();

     if (this.validate()) {
       this.submit();
     }
     return false;
   }

  var Module = TestMob.Class({
    init: function(options) {
      this.domEvents = [];
    },

    checkRequired: function(options) {
      var list = [].slice.call(arguments, 1);
      for(var item, index = 0; item = list[index]; ++index) {
        if(!options.hasOwnProperty(item)) {
          throw "missing config option: " + item;
        }
      }
    },

    start: function(options) {
    },

    stop: function() {
      this.unbindAll();
    },

    destroy: function() {
      this.stop();
    },

    bind: function(target, type, callback, context) {
      var self=this,
          cb = callback.bind(context || this);

      dom.bindEvent(target, type, cb);

      self.domEvents.push({
        target: target,
        type: type,
        cb: cb
      });
    },

    unbindAll: function() {
      var self=this,
          evt;

      while(evt = self.domEvents.pop()) {
        dom.unbindEvent(evt.target, evt.type, evt.cb);
      }
    },

    close: function(message, data) {
      this.destroy();
      if (message) {
        this.publish(message, data);
      }
    },

    publish: function(message, data) {
      mediator.publish(message, data);
    }
  });

  return Module;

}());
