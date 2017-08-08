const Discord = require('discord.js');
const client = new Discord.Client();

const t = require('./config.js');
const maps = require('./modules/ninAPI.js');
const time = require('./modules/time.js');

var currentMaps = [];
var prevMessage = null;

client.on('ready', () => {
  console.log('I am ready!');
  postCurrentMapRotation();
});

client.on('message', message => {
  var userPerm = message.member.permissions;
  if(userPerm.has(0x00002000)){ //Has the Manage Messages permission
    if (message.content === 'ping' || message.content === "!ping") {
      message.reply('pong');
    }
    if (message.content === '!clear') {
      message.channel.fetchMessages()
        .then(messages => message.channel.bulkDelete(messages)
          .then(console.log("Successfully deleted messages."))
          .catch(console.error)
        )
        .catch(console.error);
    }
    if (message.content === '!destroy') {
      client.destroy();
    }
  } else {
    //if(message.content.charAt(0) === "!") message.reply("@srs_seth done goofed, go bug him");
    //message.reply("Sorry, you don't have the necessary privelages to run this command. Ask a moderator that has the \"Manage Messages\" permission to run the command for you.")
  }
  if(message.content === '!invite'){
    var promise = message.member.guild.defaultChannel.createInvite();
    promise.then(function(result) {
      message.channel.send(result.toString());
    }, function(err) {
      console.log(err);
      messageCreator(message);
    });
  }
  if(message.content == "!maps"){
    message.reply(formatMapPost());
  }
});

function messageCreator(message){
  message.channel.send(`Something went wrong, ${message.member.guild.members.find('id', '183675563335090176')} you done goofed.`);
}

function postCurrentMapRotation(){
  if(prevMessage != null) prevMessage.delete();
  if(currentMaps.length <= 1){
    maps.getCurrentMaps().then(function(maps){
      parseMapsJSON(maps);
      return maps;
    });
  }else{
    postNextMap(true);
  }
}

function parseMapsJSON(maps){
  var d = new Date();
  var s = Math.floor(d.getTime()/1000);
  //Trim off the maps that have already been rotated through, leaving only the current and upcoming maps
  var current = 0;
  while(s > maps.gachi[current].end_time) current++;
  maps.gachi.splice(0, current);
  maps.regular.splice(0, current);
  maps.league.splice(0, current);
  //Detect if this is the first time posting since launching the bot
  if(currentMaps.length == 0) setAutoMapPost(maps.gachi[0].end_time);
  // push into an array
  currentMaps = [];
  var temp = {};
  for(var i = 0; i < maps.gachi.length; i++){
    currentMaps.push({
      ranked: {
        game_mode: maps.gachi[i].rule["name"],
        map_a: maps.gachi[i].stage_a["name"],
        map_b: maps.gachi[i].stage_b["name"]
      },
      regular: {
        game_mode: "Turf War", //Regular Battles are always Turf War at this point
        map_a: maps.regular[i].stage_a["name"],
        map_b: maps.regular[i].stage_b["name"]
      },
      league: {
        game_mode: maps.league[i].rule["name"],
        map_a: maps.league[i].stage_a["name"],
        map_b: maps.league[i].stage_b["name"]
      }
    });
  }

  postNextMap(true);
}

/*
* Formats and sends the message about the current maps,
* Also deletes the previous map if applicable.
*/
function postNextMap(shouldDelete){
  //TODO change to off-the-hook and eventually to a generalized solution
  var channel = client.guilds.find('name', 'Inkopolis Square').channels.find('name', 'current-maps');
  //delete the previous maps from the array
  if(shouldDelete) currentMaps.splice(0, 1);
  var message = formatMapPost()
  channel.send(message).then(message => prevMessage = message);
}

/*
* Helper function to format the map posting message
*/
function formatMapPost(){
  //Format message
  var message = "Ranked: " + currentMaps[0].ranked.game_mode + " - " + currentMaps[0].ranked.map_a + " - " + currentMaps[0].ranked.map_b;
  message += " \nRegular Battle: Turf War - " + currentMaps[0].regular.map_a + " - " + currentMaps[0].regular.map_b;
  message += " \nLeague: " + currentMaps[0].league.game_mode + " - " + currentMaps[0].league.map_a + " - " + currentMaps[0].league.map_b;
  return message;
}

/*
* Syncs the bot up to post the new maps every two hours with the correct offset.
*/
function setAutoMapPost(nextRotation){
  var nextPost = time.timeUntil(nextRotation) + 1 * 60 * 1000;
  client.setTimeout(function(){
    postNextMap(true);
    client.setInterval(function(){postCurrentMapRotation()},  (2 * 60 * 60 * 1000));//h * m * s * ms -- currently every two hours
  }, nextPost);
  console.log("Next post will occur in: ", nextPost/1000 + " seconds");
}

client.login(t.token);
