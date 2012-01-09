$(function() {
  "use strict";

  if($("#signout").length === 0) {
    // try a silent assertion if there is no signout button.
    navigator.id.get(on_receive_assertion, {
      silent: true
    });
  }

  function on_receive_assertion(assertion) {
    if(assertion !== null) {
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
    }
  }

  $("#signin").click(function(event) {
    event.preventDefault();

    navigator.id.get(on_receive_assertion, {
      allowPersistent: true
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

