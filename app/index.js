const Discord = require('discord.js')
const client = new Discord.Client({ autoReconnect: true })
const request = require('request');
const config = require('./config.json')

client.on('ready', () => {
  console.log("Ready!")
})

client.on('message', (msg) => {
  if(msg.author.id == client.user.id) return

  if(msg.content === '!!') {
    request(`https://api.giphy.com/v1/gifs/random?api_key=${config.giphy.token}&tag=nichijou&rating=R`, (error, response, body) => {
      let jsonBody = JSON.parse(body);

      msg.channel.send(jsonBody.data.images.original_still.url)
      .catch(console.error)
    })

  }
})

client.login(config.token)