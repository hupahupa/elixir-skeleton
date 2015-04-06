var notifier = require('node-notifier');
var util = require('gulp-util');

function standardHandler(err){
  // Send notification
  notifier.notify({
    message: 'Error: ' + err.message
  });

  // Log to console
  util.log(util.colors.red('Error'), err.message);
}

function browserifyHandler(err){
  standardHandler(err);

  // End stream
  this.end();
}

exports.browserifyHandler = browserifyHandler;
exports.handler = standardHandler;
