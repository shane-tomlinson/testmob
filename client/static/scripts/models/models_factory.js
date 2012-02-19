/*globals TestMob: true, AFrame: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.ModelsFactory = (function() {
    "use strict";

    function create(config) {
      var models = AFrame.CollectionHash.create({
        plugins: [[AFrame.CollectionPluginModel, {
          schema: config.constructor
        }]]
      });

      return models;
    }

    return {
      create: create
    }
}());
