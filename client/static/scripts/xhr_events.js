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

      self.socket.on("set_id", function(data) {
        self.client_id = data.client_id;
      });
    },

    on: function(msg, cb) {
      this.socket.on(msg, cb);
    },

    emit: function(msg, data) {
      var self=this,
          eventData = AFrame.mixin({ client_id: self.client_id }, data);

      self.socket.emit(msg, eventData);
    }
  });


  return XHREvents;

}());
