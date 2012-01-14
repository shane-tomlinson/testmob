$(function() {
  "use strict";

  if($("#signout").length === 0) {
    // try a silent assertion if there is no signout button.
    navigator.id.get(on_receive_assertion, {
      silent: true
    });
  }

  attachEvents();

  var authenticationTemplate = new EJS({ url: "/templates/authentication.ejs" });
  function updateDisplay(data) {
    data = data || {};
    var html = authenticationTemplate.render(data);
    $("#authentication").html(html);
    attachEvents();
  }

  function attachEvents() {
    $("#signin").click(signin);
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
          updateDisplay(resp);
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
          updateDisplay();
        });
      },
      error: function(resp) {

      }
    });
  }


});

