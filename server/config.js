/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


var env = process.env;

var configs = {
  local: {
    ip_address: env['IP_ADDRESS'] || "0.0.0.0",
    port: env['PORT'] || 5000,
    use_minified_resources: false
  },

  production: {
    ip_address: "0.0.0.0",
    port: env['PORT'] || 5000,
    url: "testmob.org",
    use_minified_resources: true
  }
};

configs.local.url = configs.local.ip_address + ":" + configs.local.port;

var config = env['IP_ADDRESS'] ? 'local' : 'production';
exports.config = configs[config];

