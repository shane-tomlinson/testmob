/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const
https = require('https'),
http = require('http'),
urlparse = require('urlparse'),
querystring = require('querystring');

exports.verify = function (obj, cb) {
  if (!obj) return cb("objects argument required");
  if (typeof cb !== 'function') return cb("missing required callback argument");
  if (!obj.assertion) return cb("'assertion' missing from arguments object");
  if (!obj.audience) return cb("'audience' missing from arguments object");
  if (!obj.verifier_url) obj.verifier_url = 'https://login.persona.org';

  var host = urlparse(obj.verifier_url).validate().originOnly();
  var meth = (host.scheme === 'https' ? https : http);

  var vreq = meth.request({
    host: host.host,
    port: (host.port ? host.port : (host.scheme === 'https' ? 443 : 80)),
    path: "/verify",
    method: 'POST'
  }, function(vres) {
    var body = "";
    vres.on('data', function(chunk) { body+=chunk; } )
        .on('end', function() {
          try {
            var verifierResp = JSON.parse(body);
            console.log(verifierResp);
            if (!verifierResp || !verifierResp.status === "okay") {
              throw "unhappy response from verifier";
            }
            if (!verifierResp.email) {
              throw "no email address returned from verifier";
            }
            cb(undefined, verifierResp.email);
          } catch(e) {
            cb(e);
          }
        });
  });
  vreq.setHeader('Content-Type', 'application/x-www-form-urlencoded');

  // An "audience" argument is embedded in the assertion and must match our hostname.
  // Because this one server runs on multiple different domain names we just use
  // the host parameter out of the request.
  var data = querystring.stringify({
    assertion: obj.assertion,
    audience: obj.audience
  });
  vreq.setHeader('Content-Length', data.length);
  vreq.write(data);
  vreq.end();
};
