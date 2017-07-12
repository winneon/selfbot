'use strict'

import { Command } from 'discord.js-commando'

class Clear extends Command {
  constructor(client){
    super(client, {
      name: 'clear',
      aliases: [ 'delete', 'del' ],
      group: 'util',
      memberName: 'clear',
      description: 'Clears a set amount of messages prior to and including this command call.',
      examples: [ 'clear 10' ],
      args: [{
        key: 'amount',
        prompt: "somethin",
        type: 'integer',
        default: 1,
        min: 1
      }]
    })
  }

  async run(message, args){
    let amount = args.amount + 1
    let count = 0

    let channel = message.channel

    try {
      let messages = await channel.fetchMessages()

      for (let [ id, msg ] of messages){
        if (msg.editable && count < amount){
          await msg.delete()
          count++
        }
      }
    } catch (err){
      console.error(err)
    }
  }
}

export default Clear
