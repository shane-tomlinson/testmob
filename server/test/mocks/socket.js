
function Socket() {
  this.on_handlers = {};
  this.emit_handlers = {};
}

Socket.prototype = {
  on: function(message, callback) {
    this.on_handlers[message] = callback;
  },

  /**
   * Trigger triggers an "on" handler locally, used for testing
   */
  trigger: function(message, data) {
    this.on_handlers[message](data);
  },

  emit: function(message, data) {
    this.emit_handlers[message](data);
  },

  /**
   * Bind local handlers to "emit" for testing
   */
  bind: function(message, callback) {
    this.emit_handlers[message] = callback;
  }

};

exports.Socket = Socket;

