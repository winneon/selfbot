'use strict'

import Commando from 'discord.js-commando'
import sqlite from 'sqlite'
import path from 'path'

class Client {
  constructor(owner, commandPrefix){
    this.commando = new Commando.Client({
      selfbot: true,
      unknownCommandResponse: false,
      owner,
      commandPrefix
    })

    this.commando.setProvider(
      sqlite.open(path.join(__dirname, '..', 'settings.sqlite3'))
        // a direct passing of the SQLiteProvider constructor does not work in this situation
        .then(db => new Commando.SQLiteProvider(db))
    ).catch(console.error)

    this.commando.registry
      .registerGroup('fun')
      .registerGroup('util')
      .registerDefaults()
      .registerCommandsIn(path.join(__dirname, 'commands'))

    this.commando.on('error', (err) => {
      console.error(err)
    })

    this.commando.on('commandRun', (command, promise, message, args, fromPattern) => {
      console.log(`Command: ${command.name}, Initiator: ${message.author.tag}`)
    })

    /* This event is essentially redundant because it runs at the same time as the logged in event.
     *
     * this.commando.on('ready', () => {
     *   console.log(`Ready to receive ready events. Time to start: ${this.commando.uptime / 1000}s`)
     * })
     */
  }

  async login(token){
    console.log('Attempting to login.')

    try {
      let result = await this.commando.login(token)

      if (result instanceof String || typeof result === 'string'){
        console.log('Logged in. Ready to receive events.')
        return result
      } else {
        console.error('Expected token when logging in.')
        console.error(result)
      }
    } catch (err){
      console.error('Unable to login.')
      console.error(err)
    }

    process.exit(1)
  }
}

export default Client
