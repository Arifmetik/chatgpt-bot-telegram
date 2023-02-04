const Telegraf = require("telegraf");

const { MongoClient } = require('mongodb')
const bot = new Telegraf(process.env.TG_API)

const uri = process.env.MONGO_URI
const botOwnerId = process.env.BOT_OWNER_ID

let db

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Connected to MongoDB')
    db = client.db('telegram-bot-db')
  }
})

bot.command('allow', (ctx) => {
  if (ctx.from.id.toString() === botOwnerId) {
    const userId = ctx.message.text.split(' ')[1].replace('/', '')
    db.collection('allowed_users').insertOne({ user_id: userId }, (error, result) => {
      if (error) {
        console.log(error)
      } else {
        ctx.reply(`User with ID ${userId} has been granted access to /ask command`)
      }
    })
  } else {
    ctx.reply('You are not the bot owner')
  }
})

bot.command('ask', (ctx) => {
  db.collection('allowed_users').findOne({ user_id: ctx.from.id.toString() }, (error, result) => {
    if (error) {
      console.log(error)
    } else if (result) {
      // logic for handling the /ask command
    } else {
      ctx.reply('You do not have permission to use the /ask command')
    }
  })
})

bot.launch()
