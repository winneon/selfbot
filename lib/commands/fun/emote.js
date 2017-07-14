'use strict'

import { Command } from 'discord.js-commando'
import cheerio from 'cheerio'
import twemoji from 'twemoji'
import svg2png from 'svg2png'
import https from 'https'
import path from 'path'
import fs from 'fs'

class Emote extends Command {
  constructor(client){
    super(client, {
      name: 'emote',
      memberName: 'emote',
      aliases: [ 'emoji' ],
      group: 'fun',
      description: 'Sends a larger version of an emote.',
      examples: [ 'emote' ],
      args: [{
        key: 'emote',
        prompt: 'This should never pop up, so if it does, please let me know.',
        type: 'string',
        default: ''
      }]
    })
  }

  async run(message, args){
    let emote = args.emote
    let emoteMessage = undefined

    let reply = undefined
    let url = ''
    let ext = ''
    let dest = ''
    let cont = undefined

    if (emote === ''){
      let collection = await message.channel.fetchMessages({
        limit: 1,
        before: message.id
      })

      emoteMessage = collection.array()[0]
      emote = emoteMessage.content
    }

    if (emote.startsWith('<') && emote.endsWith('>')){
      let id = emote.substring(1, emote.length - 1).split(':')[2]

      if (message.client.emojis.has(id)){
        url = message.client.emojis.get(id).url

        cont = async () => {
          try {
            let buffer = fs.readFileSync(dest)

            await reply.channel.send({
              files: [{ attachment: buffer }]
            })

            await reply.delete()
            await fs.unlink(dest)
          } catch (err){
            console.error(err)
          }
        }

        ext = 'png'
      } else {
        await message.reply('You don\'t have that emote.')
        return message.delete()
      }
    } else {
      url = cheerio.load(twemoji.parse(emote, {
        folder: 'svg',
        ext: '.svg'
      }))('img').attr('src')

      if (!url){
        await message.reply('Invalid emote.')
        return message.delete()
      }

      cont = async () => {
        try {
          let file = fs.readFileSync(dest)
          let buffer = await svg2png(file, { width: 128, height: 128 })

          await reply.channel.send({
            files: [{ attachment: buffer }]
          })

          await reply.delete()
          await fs.unlink(dest)
        } catch (err){
          console.error(err)
        }
      }

      ext = 'svg'
    }

    reply = await message.channel.send('Enlarging...')

    if (emoteMessage && emoteMessage.editable){
      await emoteMessage.delete()
    }

    await message.delete()

    dest = path.join(__dirname, 'emote.' + ext)
    let stream = fs.createWriteStream(dest)

    https.get(url, (res) => {
      res.pipe(stream)
      stream.on('finish', () => stream.close((err) => {
        if (err){
          console.error(err)
        } else {
          cont()
        }
      }))
    }).on('error', async (err) => {
      await fs.unlink(dest)
      await reply.delete()

      console.error(err)
    })
  }
}

export default Emote
