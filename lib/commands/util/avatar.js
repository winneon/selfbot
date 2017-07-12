'use strict'

import { Command } from 'discord.js-commando'

class Avatar extends Command {
  constructor(client){
    super(client, {
      name: 'avatar',
      memberName: 'avatar',
      aliases: [ 'avi' ],
      group: 'util',
      description: 'Returns the URL of a Discord user\'s avatar.',
      examples: [ 'avatar @Winneon#5622', 'avatar Winneon' ],
      args: [{
        key: 'user',
        prompt: 'This should never pop up, so if it does, please let me know.',
        type: 'user',
        default: 0
      }]
    })
  }

  async run(message, args){
    let user = args.user
    if (user === 0) user = message.author

    await message.channel.send({
      embed: {
        color: 0xFFFFFF,
        title: 'Discord Avatar Request',
        description: 'Below is the requested user\'s avatar.\nIf nothing shows up, give it a moment to load.',
        image: {
          url: user.avatarURL
        }
      }
    })

    return message.delete()
  }
}

export default Avatar
