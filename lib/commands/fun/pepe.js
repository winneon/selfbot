'use strict'

import { Command } from 'discord.js-commando'

class Pepe extends Command {
  constructor(client){
    super(client, {
      name: 'pepe',
      memberName: 'pepe',
      aliases: [ 'feels', 'feelsman', 'rare', 'rarepepe' ],
      group: 'fun',
      description: 'Send a rare Pepe.',
      examples: [ 'pepe' ]
    })
  }

  async run(message, args){
    let emojis = message.client.emojis.array().filter(emoji => emoji.name.toLowerCase().startsWith('feels'))
    let rarePepe = emojis[Math.floor(Math.random() * emojis.length)]

    await message.channel.send(`${rarePepe}`)
    return message.delete()
  }
}

export default Pepe
