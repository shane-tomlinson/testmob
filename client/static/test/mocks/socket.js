/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
TestMob.Mocks.Socket = (function() {
  "use strict";

  function Socket() {}
  Socket.prototype = {
    connect: function(url) {
      this.url = url;

      function Sock() {
        this.on_listeners = {};
        this.emit_listeners = {};
        this.emitted = {};
      }
      Sock.prototype = {
        bind: function(msg, cb) {
          this.emit_listeners[msg] = cb;
        },
        emit: function(msg, data) {
          this.emitted[msg] = data;

          if(this.emit_listeners[msg]) {
            this.emit_listeners[msg](data);
          }
        },

        on: function(msg, cb) {
          this.on_listeners[msg] = cb;
        },
        trigger: function(msg, data) {
          if(!this.on_listeners) throw "no listener registered for: " + msg;

          this.on_listeners[msg](data);
        }
      };

      return new Sock();
    }
  };

  return Socket;
}());
