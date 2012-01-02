$(function() {
  "use strict";

  var testWindow,
      email,
      url,
      resultTemplate = new EJS({ url: "/templates/testrunner_results.ejs" }),
      socket = io.connect('http://testmob.org'),
      currTestID = 0;

  socket.on('start_test', function (data, fn) {
    var initiator_id = data.initiator_id,
        email = data.email,
        url = data.url,
        testID = currTestID;

        currTestID++;

    data.complete = false;
    data.test_id = testID;
    data.email = data.email || "";

    var html = resultTemplate.render(data);
    $(html).appendTo("#results");

    socket.emit("test_start", {
      initiator_id: initiator_id,
      userAgent: navigator.userAgent
    });

    TestSwarm.Loader.load(data, function(err, data) {
      $.extend(data, {
        email: email || "",
        complete: true,
        initiator_id: initiator_id,
        url: url,
        test_id: testID
      });

      try {
        var html = resultTemplate.render(data);
      } catch(e) {
        console.log(e);
      }
      $("#" + testID).replaceWith(html);

      data.userAgent = navigator.userAgent;
      data.initiator_id = initiator_id;
      socket.emit("test_complete", data);
    });
  });


});

