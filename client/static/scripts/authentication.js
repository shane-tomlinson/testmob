$(function() {
  "use strict";

  $("#signin").click(function(event) {
    event.preventDefault();

    navigator.id.getVerifiedEmail(function(assertion) {
      $.ajax({
        type: "POST",
        url: "/wsapi/login",
        data: {
          assertion: assertion
        },
        success: function(resp) {
          window.location.reload();
        },
        error: function(resp) {
          console.log(resp);
        }
      });
    });
  });

  $("#signout").click(function(event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/wsapi/logout",
      success: function(resp) {
        window.location.reload();
      },
      error: function(resp) {

      }
    });
  });


});

