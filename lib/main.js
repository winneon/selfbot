'use strict'

import Client from './client'
import Database from './database'
import path from 'path'

class Main {
  constructor(){
    this.database = new Database(path.join(__dirname, '..', 'database.json'), true)
    let owner = this.database.getValue('owner')

    if (owner){
      this.client = new Client(owner, this.database.getValue('commandPrefix') || 'self.')
    } else {
      console.log('The bot owner cannot be found in database.json.')
      process.exit(1)
    }

    let token = this.database.getValue('token')

    if (token){
      this.client.login(token)
    } else {
      console.log('The bot token cannot be found in database.json.')
      process.exit(1)
    }
  }
}

export default Main
