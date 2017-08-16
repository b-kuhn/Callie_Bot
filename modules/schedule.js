var exports = module.exports = {};

const time = require('./time.js');
const maps = require('./maps.js');
const f = require('./format.js')

var client;
var prevMessage; //TODO figure out a better way of the bot self-moderating their messages
var channel; //TODO change to off-the-hook and eventually to a generalized solution

/**
* 'Constructs' the schedule object. Essentially instantiates some variables that will be used throughout the module
* @param (Discord CLient) The current instance of the Discord Client being used by the bot
*/
exports.constructScheduleObject = function(botClient){
  client = botClient;
  prevMessage = "";
  channel = client.guilds.find('name', 'Inkopolis Square').channels.find('name', 'current-maps');
}

/**
*
*/
exports.scheduleMapPosts = function(){
  maps.current().then(function(data){
    postMessage(f.formatMapPost(data));
    //schedule posting
    client.setTimeout(setAutoMapPost(), time.timeUntil(null, data.end_time + 10 * 1000));
  });


}

/*
* Syncs the bot up to post the new maps every two hours with the correct offset.
*/
function setAutoMapPost(){
  client.setInterval(postCurrentRotation,  (2 * 60 * 60 * 1000));//h * m * s * ms -- currently every two hours
}

/**
* Posts the current rotation of stages
*/
function postCurrentRotation(){
  maps.current().then(function(maps){

  });
}

/**
*
*/
function postMessage(post){
  channel.send(post).then(message => prevMessage = message);
}
