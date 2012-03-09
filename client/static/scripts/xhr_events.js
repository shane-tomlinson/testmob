/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
TestMob.XHREvents = (function() {
  "use strict";

  var tm = TestMob;

  var XHREvents = tm.Module.extend({
    start: function(config) {
      var self=this;

      self.checkRequired(config, "io", "url");

      self.io = config.io;
      self.socket = self.io.connect(config.url);

      self.socket.on("set_client_id", function(data) {
        self.client_id = data.client_id;
      });
    },

    subscribe: function(msg, cb) {
      this.socket.on(msg, function(data) {
        cb(msg, data);
      });
    },

    publish: function(msg, data) {
      var self=this,
          eventData = AFrame.mixin({}, data, { client_id: self.client_id, email: self.email || "" });

      self.socket.emit(msg, eventData);
    },

    setEmail: function(email) {
      this.email = email;
    },

    getSocket: function() {
      return this.socket;
    }
  });


  return XHREvents;

}());
