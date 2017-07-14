'use strict'

import { Command, FriendlyeError } from 'discord.js-commando'
import translate from 'google-translate-api'

class Translate extends Command {
  constructor(client){
    super(client, {
      name: 'translate',
      memberName: 'translate',
      group: 'util',
      description: 'Translates a string into a specified language.',
      examples: [ 'translate' ],
      args: [
        {
          key: 'to',
          prompt: "What language do you want to convert the string into?",
          type: 'string',
          max: 2
        },
        {
          key: 'text',
          prompt: 'This should never pop up, so if it does, please let me know.',
          type: 'string',
          default: ''
        }
      ]
    })
  }

  async run(message, args){
    let to = args.to
    let text = args.text

    if (text === ''){
      let collection = await message.channel.fetchMessages({
        limit: 1,
        before: message.id
      })

      text = collection.array()[0].content

      if (text === ''){
        await message.reply('The message above this message is empty, so there\'s nothing to translate.')
        return message.delete()
      }
    }

    let res = await translate(text, { to })
    let translated = res.text

    await message.channel.send(translated)
    return message.delete()
  }
}

export default Translate
