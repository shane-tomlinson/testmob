/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      XHREvents = tm.XHREvents,
      Socket = tm.Mocks.Socket,
      socketMock;

  module("xhr_events", {
    setup: function() {
      socketMock = new Socket();

      this.events = XHREvents.create();
      this.events.start({
        io: socketMock,
        url: "http://testurl.org/endpoint"
      });

    },

    teardown: function() {

    }
  });

  test("create/start - connects to endpoint", function() {
    equal(socketMock.url, "http://testurl.org/endpoint", "connection established to endpoint");
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

    equal(this.events.socket.emitted.message.key, "value", "message emitted with correct data");
  });

  test("emit after set_client_id emitted - emit a message with client_id", function() {
    this.events.socket.trigger("set_client_id", { client_id: "id" });
    this.events.emit("message", { key: "value" });

    equal(this.events.socket.emitted.message.client_id, "id", "message emitted with correct client_id");
  });

  test("emit after setEmail - emit a message with an email", function() {
    this.events.setEmail("client@client.com");
    this.events.emit("message", { key: "value" });

    equal(this.events.socket.emitted.message.email, "client@client.com", "message emitted with correct email");
  });

}());
