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

