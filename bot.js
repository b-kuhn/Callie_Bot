const Discord = require('discord.js');
const client = new Discord.Client();

const t = require('./config.js');
const maps = require('./modules/ninAPI.js');

var currentMaps = 0;
var prevMessage = null;

client.on('ready', () => {
  console.log('I am ready!');
  client.setInterval(postCurrentMapRotation, getInterval());
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
    //if(message.content.charAt(0) === "!") message.reply("@srs_seth fucked up again, go bug him");
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
});

function messageCreator(message){
  message.channel.send(`Something went wrong, ${message.member.guild.members.find('id', '183675563335090176')} you done goofed.`);
}

function getInterval(){
  //2h * 60min/h * 60s/min * 1000ms/s
  //return 2 * 60 * 60 * 1000;
  return 6000;
}

function postCurrentMapRotation(){
  //TODO change to off-the-hook and eventually to a generalized solution
  var channel = client.guilds.find('name', 'Inkopolis Square').channels.find('name', 'bot-spam');
  if(prevMessage !== null && prevMessage !== {}) prevMessage.delete();
  if(currentMaps == 0){
    console.log("inside if statement")
    maps.getCurrentMaps().then(function(maps){
      parseMapsJSON(maps);
      return maps;
    });
  }else{
    console.log("inside else statement")
    console.log(currentMaps)
    postNextMap();
  }
}

function parseMapsJSON(maps){
  var d = new Date();
  var s = Math.floor(d.getTime()/1000);
  //Trim off the maps that have already been rotated through, leaving only the current and upcoming maps
  var current = 0;
  console.log(maps.gachi[0])
  console.log(maps.gachi[0].end_time)
  console.log(s)
  while(s > maps.gachi[current].end_time){
    console.log(current, s, maps.gachi[current].end_time, s > maps.gachi[current].end_time)
    current++;
  }
  maps.gachi.splice(0, current);
  maps.regular.splice(0, current);
  maps.league.splice(0, current);

  console.log(maps)
  // push into an array
  // currentMaps = [];
  // var temp = {};
  // for(var i = 0; i < maps.gachi.length; i++){
  //   temp = {
  //     ranked: {
  //       game_mode: maps.gachi[0].rule[]
  //     }
  //   }
  // }
}

function postNextMap(){

}

client.login(t.token);
