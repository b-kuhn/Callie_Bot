var fs = require('fs')

var exports = module.exports = {};

exports.logging = true;

fs.open('log.txt', 'w', function (err, file) { if (err) throw err; });

exports.write = function(message, type){
  write(message, type);
}

function write(message, type){
  var d = new Date();
  var timestamp = d.toTimeString().split(" ")[0];
  var log = type + " " + timestamp + ": " + message;
  fs.appendFile('log.txt', message, function(err){ if (err) throw err;});
}
