/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.Models.Test = (function() {
  "use strict";

  var tm = TestMob,
      sc;

  var Model = tm.Model.extend({
    schema: {
      test_id:      { type: "text" },
      email:        { type: "text" },
      complete:     { type: "boolean", def: false },
      passed:       { type: "integer", def: 0 },
      failed:       { type: "integer", def: 0 },
      failed_tests: { has_many: true },
      total:        { type: "integer", def: 0 },
      runtime:      { type: "integer", def: 0 },
      start_time:   { type: "integer", def: 0 },
      msg:          { type: "string", def: undefined },
      url:          { type: "string", def: undefined },
      user_agent:   { type: "string", def: navigator.userAgent },
      log:         { has_many: true },
      warn:        { has_many: true },
      error:       { has_many: true },
    },

    init: function(config) {
      sc.init.call(this, config);

      var data = config.data;
      if(!(data && data.start_time)) {
        this.set("start_time", new Date().getTime());
      }
    },

    complete: function() {
      this.set({complete: true});
    }
  });

  sc = Model.sc;

  return Model;
}());


