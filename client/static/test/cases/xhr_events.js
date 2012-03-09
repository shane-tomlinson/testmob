/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      XHREvents = tm.XHREvents,
      Socket = tm.Mocks.Socket;

  module("xhr_events", {
    setup: function() {
      this.events = XHREvents.create();
      this.events.start({
        io: Socket,
        url: "http://testurl.org/endpoint"
      });

    },

    teardown: function() {

    }
  });

  test("create/start - connects to endpoint", function() {
    equal(this.events.getSocket().url, "http://testurl.org/endpoint", "connection established to endpoint");
  });

  asyncTest("subscribe - register a handler", function() {
    this.events.subscribe("message", function(msg, data) {
      equal(msg, "message", "correct message passed");
      equal(data.key, "value", "correct value passed");
      start();
    });

    this.events.getSocket().emit("message", { key: "value" });
  });

  test("publish - publish a message", function() {
    this.events.publish("message", { key: "value" });

    equal(this.events.getSocket().emitted.message.key, "value", "message emitted with correct data");
  });

  test("publish after set_client_id emitted - publish a message with client_id", function() {
    this.events.getSocket().emit("set_client_id", { client_id: "id" });
    this.events.publish("message", { key: "value" });

    equal(this.events.getSocket().emitted.message.client_id, "id", "message emitted with correct client_id");
  });

  test("publish after setEmail - publish a message with an email", function() {
    this.events.setEmail("client@client.com");
    this.events.publish("message", { key: "value" });

    equal(this.events.getSocket().emitted.message.email, "client@client.com", "message emitted with correct email");
  });

}());
