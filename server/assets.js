/**
* List of resources to be included/compressed.
*/

var assets = {
  "/production/main.min.js": [
    "/lib/jquery.min.js",
    "/lib/ejs.js",
    "/lib/extensions.js",
    "/lib/aframe-0.0.71-jquery.js",
    "/lib/hub.js",
    "/scripts/core/test_mob.js",
    "/scripts/core/class.js",
    "/scripts/core/dom.js",
    "/scripts/core/helpers.js",
    "/scripts/core/ajax.js",
    "/scripts/core/mediator.js",
    "/scripts/core/model.js",
    "/scripts/core/module.js",
    "/scripts/core/module_manager.js",
    "/scripts/core/renderer.js",
    "/scripts/core/templates.js",
    "/scripts/core/tooltip.js",

    "/scripts/models/authentication.js",
    "/scripts/models/test.js",
    "/scripts/models/client_test.js",

    "/scripts/views/authentication.js",
    "/scripts/views/test.js",

    "/scripts/job_runner.js",
    "/scripts/job_loader.js",
    "/scripts/boss.js",
    "/scripts/family.js",

    "/scripts/start.js"
  ]
};

exports.assets = assets;
