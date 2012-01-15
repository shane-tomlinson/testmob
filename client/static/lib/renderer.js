/*jshint browsers:true, forin: true, laxbreak: true */
/*global TestMob: true */

/* Original code from Mozilla's BrowserID */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
TestMob.Renderer = (function() {
  "use strict";

  var ts = TestMob,
      dom = ts.DOM,
      templateCache = {};

  function getTemplateHTML(templateName, vars) {
    var config,
        templateText = ts.Templates[templateName];

    if(templateText) {
      config = {
        text: templateText
      };
    }
    else {
      // TODO - be able to set the directory
      config = {
        url: "/dialog/views/" + templateName + ".ejs"
      };
    }

    var template = templateCache[templateName];
    if(!template) {
      template = new EJS(config);
      templateCache[templateName] = template;
    }

    var html = template.render(vars);
    return html;
  }

  function render(target, templateName, vars) {
    var html = getTemplateHTML(templateName, vars);
    return dom.setInner(target, html);
  }

  function append(target, templateName, vars) {
    var html = getTemplateHTML(templateName, vars);
    return dom.appendTo(html, target);
  }

  return {
    render: render,
    append: append
  }
}());

