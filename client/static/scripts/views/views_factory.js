/*globals TestMob: true, AFrame: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

TestMob.ViewsFactory = (function() {
    "use strict";

    var tm = TestMob,
        TestView = tm.Modules.Test,
        renderer = tm.Renderer,
        dom = tm.DOM;

    function create(config) {
      var listEl = renderer.append("body", config.list_template, config);
      if(dom.getChildren("#results").length) {
        dom.insertBefore(listEl, "#results > *:first-child");
      }
      else {
        dom.appendTo(listEl, "#results");
      }

      var list = AFrame.List.create({
        target: listEl,
        renderItem: function(model, index) {
          var data = model.toObject(),
              selector = "#" + data.test_id,
              createContainer = dom.createElement("div");

          dom.appendTo(createContainer, "body");
          renderer.render(createContainer, config.result_template, data);

          var el = $(selector);
          dom.removeElement(createContainer);

          return el;
        },
        plugins: [[AFrame.ListPluginBindToCollection, {
          collection: config.models
        }], [AFrame.ListPluginFormRow, {
          formFactory: function(rowElement, data) {
            var form = TestView.create({
              target: rowElement,
              data: data
            });
            return form;
          }
        }]
        ]
      });

      return list;
    }

    return {
      create: create
    }

}());

