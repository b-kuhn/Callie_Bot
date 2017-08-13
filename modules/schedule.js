var exports = module.exports = {};

const time = require('./time.js');

exports.scheduleMapPosts = function(client){
  var nextPost = time.timeUntil(nextRotation) + 1 * 60 * 1000;
}


/*
* Syncs the bot up to post the new maps every two hours with the correct offset.
*/
function setAutoMapPost(nextRotation){
  var nextPost = time.timeUntil(nextRotation) + 1 * 60 * 1000;
  client.setTimeout(function(){
    postNextMap(false);
    client.setInterval(function(){postCurrentMapRotation()},  (2 * 60 * 60 * 1000));//h * m * s * ms -- currently every two hours
  }, nextPost);
  console.log("Next post will occur in: ", time.getElapsedTime(nextPost));
}
