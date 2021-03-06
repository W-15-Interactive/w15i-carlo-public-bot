const { Command } = require('discord.js-commando');
const mongoose = require('mongoose');
const Profile = require('../../models/profileSchema');

module.exports = class balanceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bal',
      aliases: ['balance', 'money'],
      group: 'economy',
      memberName: 'balance',
      description: "Checks user or mentioned member's balance",
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5,
      },
      examples: [
        '`w!bal <nothing or a user>`',
        '`w!balance <nothing or a user>`',
        '`w!money <nothing or a user>`',
      ],
    });
  }

  async run(message) {
    const user = message.mentions.users.first() || message.author;

    Profile.findOneAndUpdate(
      {
        userID: user.id,
      },
      { username: user.username },
      { new: true },
      (err, profile) => {
        if (err) console.log(err);
        if (!profile) {
          return message.channel.send(
            `${user.username}, you don\'t have any money.`
          );
        } else {
          message.channel.send(
            `${user.username}, you have ${profile.money} Sylva.`
          );
        }
      }
    );
  }
};
