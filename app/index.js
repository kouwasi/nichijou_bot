const Discord = require('discord.js')
const client = new Discord.Client({ autoReconnect: true })
const config = require('./config.json')

client.on('ready', () => {
  console.log("Ready!")
})

client.on('message', (msg) => {
  console.log(msg)
})

client.login(config.token)