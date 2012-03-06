/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


var env = process.env;

var configs = {
  local: {
    ip_address: env['IP_ADDRESS'] || "0.0.0.0",
    port: env['PORT'] || 5000,
    use_minified_resources: false,
    redis_url: "http://" + (env['IP_ADDRESS'] || "0.0.0.0") + ":6379"
  },

  production: {
    ip_address: env['IP_ADDRESS'] || "0.0.0.0",
    port: env['PORT'] || 5000,
    url: "testmob.org",
    use_minified_resources: true,
    redis_url: env['REDISTOGO_URL']
  }
};

configs.local.url = configs.local.ip_address + ":" + configs.local.port;

var environment = env['NODE_ENV'] || "local";
exports.config = configs[environment];

console.log("using environment: " + environment);

