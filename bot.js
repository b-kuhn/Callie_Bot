const Discord = require('discord.js');
const client = new Discord.Client();

const t = require('./config.js');

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  var userPerm = message.member.permissions;
  if(userPerm.has(0x00002000)){ //Has the Manage Messages permission
    if (message.content === 'ping') {
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
      message.channel.send("Sorry something went wrong. Bug @srs_seth#9746 about this one.")
    });
  }
});

function messageCreator(message){
  message.channel.send(`Something went wrong, ${message.member.guild.members.find('id', '183675563335090176')} you done goofed.`);
}
client.login(t.token);
