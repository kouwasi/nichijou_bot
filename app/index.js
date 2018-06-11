const Discord = require('discord.js')
const client = new Discord.Client({ autoReconnect: true })
const request = require('request');
const config = require('./config.json')

client.on('ready', () => {
  console.log("Ready!")
})

client.on('message', async (msg) => {
  if(msg.author.id == client.user.id) return

  if(msg.content === '!!') {
    if(getRandomInt(2) == 0) {
      url = await getUrlFromTenor().catch(console.error)
    } else {
      url = await getUrlFromGiphy().catch(console.error)
    }

    msg.channel.send(url)
    .catch(console.error)
  } else if(msg.content === '!!!') {
    msg.channel.send(baobab())
  }
})

function getUrlFromGiphy() {
  return new Promise((resolve, reject ) => {
    request(`https://api.giphy.com/v1/gifs/random?api_key=${config.giphy.token}&tag=nichijou&rating=R`, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        resolve(JSON.parse(body).data.url)
      } else {
        reject(error)
      }
    })
  })
}

function getUrlFromTenor() {
  return new Promise((resolve, reject ) => {
    request(`https://api.tenor.com/v1/random?key=${config.tenor.token}&q=nichijou&safesearch=moderate&limit=1`, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        resolve(JSON.parse(body).results[0].url)
      } else {
        reject(error)
      }
    })
  })
}

function baobab() {
  let parts = ['バ', 'オ', 'ブ', 'ヲ', 'ン', 'ビ', 'ボ','ァ','ォ','ヮ','ッ', 'ー'],
      tail = 'の樹',
      loop = getRandomInt(15),
      value

  for(i=0; i <= loop; i++) {
    if(value) {
      value += parts[getRandomInt(12)]
    } else {
      value = parts[getRandomInt(7)]
    }
  }
  
  return value + tail
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

client.login(config.discord.token)