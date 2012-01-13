$(function() {
  "use strict";

  if($("#signout").length === 0) {
    // try a silent assertion if there is no signout button.
    navigator.id.get(on_receive_assertion, {
      silent: true
    });
    $("#signin").click(signin);
  }
  else {
    $("#signout").click(signout);
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
          if(resp.success) {
            var text = $("<span class='right' id='authentication'>Hi " + resp.email + ", <a href='#' id='signout'>Sign Out</a></span>");
            $("#authentication").replaceWith(text);
            $("#signout").click(signout);
          }
        },
        error: function(resp) {
          console.log(resp);
        }
      });
    }
  }

  function signin(event) {
    event.preventDefault();

    navigator.id.get(on_receive_assertion, {
      allowPersistent: true
    });
  }

  function signout(event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/wsapi/logout",
      success: function(resp) {
        navigator.id.logout(function() {
          var text = $("<a href='#' id='signin'>Sign In</a>");
          $("#authentication").html(text);
          $("#signin").click(signin);
        });
      },
      error: function(resp) {

      }
    });
  }


});

