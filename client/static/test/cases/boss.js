/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      Boss = tm.Modules.Boss,
      boss,
      Socket = tm.Mocks.Socket,
      socket;

  module("boss", {
    setup: function() {
      socket = new Socket();
      socket.connect("http://testmob.org");
    },

    teardown: function() {
    }
  });

  test("can create boss", function() {
    boss = Boss.create({});
    boss.start({
      socket: socket.socket
    });

    ok(boss, "boss created");
  });

}());
