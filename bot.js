const Discord = require('discord.js');
const client = new Discord.Client();

//Grab custom modules
const t = require('./config.js');
const log = require('./modules/log.js');
const map = require('./modules/maps.js')
const f = require('./modules/format.js')

//Bot has just started up, begin auto post schedules
client.on('ready', () => {
  console.log('I am ready!');
  //postCurrentMapRotation();
});

//Parse messages, decide if they are commands and react accordingly
//TODO move to module
client.on('message', message => {
  var userPerm = message.member.permissions;

  //Has the Manage Messages permission
  if(userPerm.has(0x00002000)){
    //Clears a bunch of messages to clean up a channel
    if (message.content === '!clear') {
      message.channel.fetchMessages()
        .then(messages => message.channel.bulkDelete(messages)
          .then(console.log("Successfully deleted messages."))
          .catch(console.error)
        )
        .catch(console.error);
    }
    //Destroy the client, log the bot off
    if (message.content === '!destroy') {
      client.destroy();
    }
  }

  //Generate an invite link for the server
  if(message.content === '!invite'){
    var promise = message.member.guild.defaultChannel.createInvite();
    promise.then(function(result) {
      message.channel.send(result.toString());
    }, function(err) {
      console.log(err);
      messageCreator(message); //message @srs_seth
    });
  }
  //Post the current rotation of maps
  if(message.content == "!maps"){
    map.current().then(function(map){
      message.channel.send(f.formatMapPost(map));
    })
  }
  //Simple command to see if the bot is alive
  if (message.content === '!ping' || message.content === "!stay" || message.content === "!stayfresh") {
    message.reply('Stay Fresh!');
  }
});

/*
* Pings @srs_Seth to let him know something went wrong
*/
function messageCreator(message){
  message.channel.send(`Something went wrong, ${message.member.guild.members.find('id', '183675563335090176')} you done goofed.`);
}


client.login(t.token);
