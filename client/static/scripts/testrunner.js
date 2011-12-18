$(function() {
    "use strict";

    var testWindow;

    var socket = io.connect('http://192.168.1.88:3000');
    socket.on('start_test', function (data) {

      socket.emit("test_start", JSON.stringify({
        userAgent: navigator.userAgent
      }));

      testWindow = WinChan.open(data.url, "http://192.168.1.88:10002/relay", "", {}, function(err, data) {
        var parsed = JSON.parse(data);

        $("<li>Passed: " + parsed.passed + "</li>").appendTo("#results");
        $("<li>Failed: " + parsed.failed + "</li>").appendTo("#results");
        $("<li>Total: " + parsed.total + "</li>").appendTo("#results");
        $("<li>Runtime: " + parsed.runtime + "</li>").appendTo("#results");
        testWindow.close();

        parsed.userAgent = navigator.userAgent;
        socket.emit("test_complete", JSON.stringify(parsed));
      });
    });


});

