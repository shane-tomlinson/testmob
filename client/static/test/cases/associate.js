/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var tm = TestMob,
      Associate = tm.Modules.Associate,
      associate,
      Socket = tm.Mocks.Socket,
      socket;

  module("associate", {
    setup: function() {
      socket = new Socket();
      socket.connect("http://testmob.org");
    },

    teardown: function() {
    }
  });

  test("can create associate", function() {
    associate = Associate.create({});
    associate.start({
      socket: socket.socket
    });

    ok(associate, "associate created");
  });

}());
