var verify = require("./browserid_client").verify;

function doVerify(data, fn) {
  verify({
    assertion: data.assertion,
    audience: "http://testmob.org"
  }, function(err, email) {
    console.log(err);
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

