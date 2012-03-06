/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
TestMob.Mocks.Socket = (function() {
  "use strict";

  function Socket() {}
  Socket.prototype = {
    connect: function(url) {
      this.url = url;

      this.socket = {
        listeners: {},
        triggered: {},
        emit: function(msg, data) {
          this.triggered[msg] = data;
        },
        on: function(msg, cb) {
          this.listeners[msg] = cb;
        },
        trigger: function(msg, data) {
          this.listeners[msg](data);
        }
      };

      return this.socket;
    }
  };

  return Socket;
}());
