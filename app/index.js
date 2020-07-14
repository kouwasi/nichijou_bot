const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const request = require('request');
const config = require('./config.json');
const MeCab = new require('mecab-async');

String.prototype.toGenshi = function() {
  let text = this.toString();
  let morphs = MeCab.parseSyncFormat(text);
  let replyArray = [];

  morphs.map(x => x.lexical != '助詞' ? replyArray.push(x.reading) : '');

  return replyArray.join(' ');
}

client.on('ready', () => {
  console.log("Ready!");

  // init mecab
  MeCab.command = `mecab -d ${process.env.MECAB_DICTIONARY_PATH}`;
});

client.on('message', async (msg) => {
  if(msg.author.id == client.user.id) return;

  let command = msg.content.split(' ');

  if(command[0] == undefined) return;

  switch (command[0]) {
    case '!':
      msg.channel.send(shuffle(msg.content));
      break;
    case '!!':
      commandGif(msg);
      break;
    case '!!!':
      msg.channel.send(baobab());
      break;
  }

  if (['!g', '!genshi'].includes(command[0])) {
    let content = msg.content.slice(3);
    msg.channel.send(content.toGenshi());
  }
});

async function commandGif(msg) {
  const tagName = encodeURIComponent(msg.content.slice(3));
  
  if(getRandomInt(2) == 0) {
    url = await getUrlFromTenor(tagName ? tagName : 'nichijou').catch(error => {
      console.log(error);
      msg.channel.send(`\`\`\`${error}\`\`\``);
    });
  } else {
    url = await getUrlFromGiphy(tagName ? tagName : 'nichijou').catch(error => {
      console.log(error);
      msg.channel.send(`\`\`\`${error}\`\`\``);
    });
  }

  if(url) {
    msg.channel.send(url).catch(console.error);
  }
}

function getUrlFromGiphy(tagName) {
  return new Promise((resolve, reject) => {
    request(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_TOKEN}&tag=${tagName}&rating=R`, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        resolve(JSON.parse(body).data.url);
      } else {
        reject(error);
      }
    })
  })
}

function getUrlFromTenor(tagName) {
  return new Promise((resolve, reject) => {
    request(`https://api.tenor.com/v1/random?key=${process.env.TENOR_TOKEN}&q=${tagName}&safesearch=moderate&limit=1`, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        if(JSON.parse(body).results[0]) {
          resolve(JSON.parse(body).results[0].url)
        } else {
          reject('Error: Invalid format response.');
        }    
      } else {
        reject(error);
      }
    })
  })
}

function shuffle(msg) {
  msg = msg.slice(2);
  msgArray = Array.from(msg);

  let reply = '';
  for(i=0; i < msgArray.length; i++) {
    reply += msgArray[getRandomInt(msgArray.length)];
  }

  return reply;
}

function baobab() {
  let parts = ['バ', 'オ', 'ブ', 'ヲ', 'ン', 'ビ', 'ボ','ァ','ォ','ヮ','ッ', 'ー'],
      loop = getRandomInt(15),
      value;

  for(i=0; i <= loop; i++) {
    if(value) {
      value += parts[getRandomInt(12)];
    } else {
      value = parts[getRandomInt(7)];
    }
  }
  
  return value + 'の樹';
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

client.login(process.env.DISCORD_TOKEN);
