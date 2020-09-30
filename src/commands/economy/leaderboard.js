const { Command } = require('discord.js-commando');
const mongoose = require('mongoose');
const Profile = require('../../models/profileSchema');
const Discord = require('discord.js');

module.exports = class leaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['lb'],
      group: 'economy',
      memberName: 'leaderboard',
      description: 'Opens up the user leaderboard',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3,
      },
      examples: ['`w!leaderboard`', '`w!lb`'],
    });
  }

  async run(message) {
    //Grab all of the users in said server
    await Profile.find({ serverID: message.guild.id })
      .sort([['money', 'descending']])
      .exec((err, res) => {
        if (err) console.log(err);

        let embed = new Discord.MessageEmbed()
          .setTitle('Leaderboard')
          .setFooter('Powered by W-15i Bank');
        //if there are no results
        if (res.length === 0) {
          embed.setColor('RED');
          embed.addField(
            'No data found',
            'Please type in do `w!work` to gain money!'
          );
        } else if (res.length < 10) {
          //Less than 10 results
          embed.setColor('BLURPLE');
          for (let i = 0; i < res.length; i++) {
            let member =
              message.guild.members.cache.get(res[i].userID) || 'User Left';
            if (member === 'User Left') {
              embed.addField(
                `${i + 1}. ${member}`,
                `**Money**: ${res[i].money}`
              );
            } else {
              embed.addField(
                `${i + 1}. ${member.user.username}`,
                `**Money**: ${res[i].money}`
              );
            }
          }
        } else {
          //More than 10 results
          embed.setColor('BLURPLE');
          for (let i = 0; i < 10; i++) {
            let member =
              message.guild.members.cache.get(res[i].userID) || 'User Left';
            if (member === 'User Left') {
              embed.addField(
                `${i + 1}. ${member}`,
                `**Money**: ${res[i].coins}`
              );
            } else {
              embed.addField(
                `${i + 1}. ${member.user.username}`,
                `**Money**: ${res[i].money}`
              );
            }
          }
        }

        message.channel.send(embed);
      });
  }
};