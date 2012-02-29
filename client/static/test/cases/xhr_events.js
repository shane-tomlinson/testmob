/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      XHREvents = tm.XHREvents,
      ioMock;

  function IOMock() {}
  IOMock.prototype = {
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

  module("xhr_events", {
    setup: function() {
      ioMock = new IOMock();

      this.events = XHREvents.create();
      this.events.start({
        io: ioMock,
        url: "http://testurl.org/endpoint"
      });

    },

    teardown: function() {

    }
  });

  test("create/start - connects to endpoint", function() {
    equal(ioMock.url, "http://testurl.org/endpoint", "connection established to endpoint");
  });

  asyncTest("on - register a handler", function() {
    this.events.on("message", function() {
      ok(true, "handler correctly registered");
      start();
    });

    this.events.socket.trigger("message");
  });

  test("emit - emit a message", function() {
    this.events.emit("message", { key: "value" });

    equal(this.events.socket.triggered.message.key, "value", "message triggered with correct data");
  });

  test("emit after set_id triggered - emit a message with client_id", function() {
    this.events.socket.trigger("set_id", { client_id: "id" });
    this.events.emit("message", { key: "value" });

    equal(this.events.socket.triggered.message.client_id, "id", "message triggered with correct client_id");
  });

}());
