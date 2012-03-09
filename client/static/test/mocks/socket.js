/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
TestMob.Mocks.Socket = (function() {
  "use strict";

  function Socket(url) {
    this.url = url;
    this.listeners = {};
    this.emitted = {};
  }
  Socket.prototype = {
    emit: function(msg, data) {
      this.emitted[msg] = data;

      if(this.listeners[msg]) {
        this.listeners[msg](data);
      }
    },

    on: function(msg, cb) {
      this.listeners[msg] = cb;
    }
  };

  return {
    connect: function(url) {
      return new Socket(url);
    }
  };
}());
