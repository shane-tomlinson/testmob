/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var verify = require("./browserid_client").verify;

function doVerify(data, fn) {
  verify({
    assertion: data.assertion,
    audience: data.audience || "http://testmob.org"
  }, function(err, email) {
    if(err) {
      fn(err, null);
    }
    else {
      fn(null, {
        success: true,
        email: email
      });
    }
  });
}

exports.verify = doVerify;

