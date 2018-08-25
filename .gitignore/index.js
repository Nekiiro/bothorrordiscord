const Discord = require('discord.js');

const client = new Discord.Client();

var prefix = "!";

const ytdl = require('ytdl-core');

const queue = new Map();

var servers = {};

var fs = require('fs');

client.login("process.env.TOKEN");

function play(connection, message) {
  
    var server = servers[message.guild.id];
  
    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
  
    server.queue.shift();
  
    server.dispatcher.on("end", function() { 
      if (server.queue[0]) play(connection, message);
  
      else connection.disconnect();
  
    });
  }

client.on("ready", () => {
    console.log("Je suis prêt !")
    client.user.setActivity("être un bot");
});

client.on('message', message => {

    if(message.content === "Bonjour"){
        message.reply("Bonjour.")
    }
    if(message.content === "Salut"){
        message.reply("Salut.")
    }
    if(message.content === "salut"){
        message.reply("salut.")
    }
    if(message.content === "cv ?"){
        message.reply("bien et toi ?")
    }
    if(message.content === "ça va ?"){
        message.reply("yop et toi ?")
    }
    if(message.content === "sava ?"){
        message.reply("Très bien merci")
    }
    if(message.content === "sa va ?"){
        message.reply("ouai et toi ?")
    }
    if(message.content === "ca va ?"){
        message.reply("trkl et toi ?")
    }
    if(message.content ==="connard"){
        message.reply("chtebèz")
    }

    if(message.content === prefix + "info"){
        var info_embed = new Discord.RichEmbed()
        .setColor("#40A497")
        .setTitle("Voici les informations du serveur")
        .addField(" :robot: Nom :", `${client.user.tag}`, true)
        .addField("Descriminateur du bot :hash:", `#${client.user.discriminator}`)
        .addField("ID :id:: ", `${client.user.id}`)
        .addField("Nombre de membre", message.guild.members.size)
        .addField("Nombre de catégories et de salons", message.guild.channels.size)
        .setFooter("info")
        message.channel.sendMessage(info_embed)
    }

    if(message.content === prefix + "aide"){
        var help_embed = new Discord.RichEmbed()
        .setColor("#40A497")
        .setTitle("Voici mes commandes d'aide")
        .setDescription("Je suis un gentil bot et voici mes commandes")
        .addField("!aide", "Affiche les commandes du bot")
        .addField("!info", "Affiche les infos du serveur")
        .addField("Bonjour", "Le bot répond")
        .addField("!clear (Un nombre)", "Permet de supprimer des messages")
        .setFooter("Menu d'aide")
        message.channel.sendMessage(help_embed);
    }

    if(message.content.startsWith(prefix + "clear")) {
        if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous n'avez pas cette permission")

        let args = message.content.split(" ").slice(1);

        if(!args[0]) return message.channel.send("Tu dois mettre le nombre de messages à supprimer")
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`${args[0]} messages ont été supprimés`);
        })
    }

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()) { 

        case "stats":

        var userCreateDate = message.author.createdAt.toString().split(" ");
        var msgauthor = message.author.id;

        var stats_embed = new Discord.RichEmbed()
        .setColor("#6699FF")
        .setTitle(`Statistiques du joueurs : ${message.author.username}`)
        .addField(`ID du joueurs :id:`, msgauthor, true)
        .addField(`Date d'inscription du joueur :`, userCreateDate[1] + ' ' + userCreateDate[2] + ' ' + userCreateDate[3])
        .setThumbnail(message.author.avatarURL)
        message.reply("Tu peux regarder tes messages privés !")
        message.author.send(stats_embed);

        break;
        
  case "play":

    if (!args[1]) {

    message.channel.sendMessage("Tu dois m’indiquer un lien YouTube"); 

    return;

  }

    if(!message.member.voiceChannel) {

    message.channel.sendMessage(":x: Tu dois être dans un salon vocal"); 

    return;

  }


    if(!servers[message.guild.id]) servers[message.guild.id] = {

    queue: []

  };


  var server = servers[message.guild.id];


  server.queue.push(args[1]);

  if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {

  play(connection, message) 

  });

  break; 

  case "skip":

    if(!message.member.voiceChannel) {

    message.channel.sendMessage(":x: Tu dois être dans un salon vocal"); 

    return;

  }

    var server = servers[message.guild.id];

    if(server.dispatcher) server.dispatcher.end();

    break;

  case "stop":

    if(!message.member.voiceChannel) 
    
    return message.channel.send(":x: Tu dois être dans un salon vocal");

    message.member.voiceChannel.leave();

    break;
    
    }
});
