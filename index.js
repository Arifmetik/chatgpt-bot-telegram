require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const { getImage, getChat } = require("./Helper/functions");
const { Telegraf } = require("telegraf");

const configuration = new Configuration({
  apiKey: process.env.API,
});
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);
bot.start((ctx) => ctx.reply("Welcome , You can ask anything from me"));

bot.help((ctx) => {
  ctx.reply(
    "This bot can perform the following command \n /image -> to create image from text \n /ask -> ank anything from me "
  );
});

//Test translate
const translate = require('translate-google');


bot.command('eng_uz', async ctx => {
  const text = ctx.message.text.split(' ').slice(1).join(' ');
  try {
    const translation = await translate(text, { to: 'uz' });
    ctx.reply(translation);
  } catch (error) {
    ctx.reply('Try again');
  }
});

bot.command('uz_eng', async ctx => {
  const text = ctx.message.text.split(' ').slice(1).join(' ');
  try {
    const translation = await translate(text, { to: 'en' });
    ctx.reply(translation);
  } catch (error) {
    ctx.reply('Try again');
  }
  });


// Post stats

bot.command('store', (ctx) => {
  const data = ctx.message.text.split(' ').slice(1).join(' ');
  const chatId = process.env.DATABASE_CHAT_ID; // the chat ID of the private channel
  ctx.telegram.sendMessage(chatId, data);
});

bot.command('retrieve', (ctx) => {
  const chatId = process.env.DATABASE_CHAT_ID; // the chat ID of the private channel
  ctx.telegram.getHistory(chatId, 0, 0, 100).then((messages) => {
    const data = messages.map((message) => message.text).join('\n');
    ctx.reply(data);
  }).catch((error) => {
    ctx.reply('Error retrieving data from the database');
  });
});

// Test commands
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_DB_URL;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  const db = client.db('mydb');
  const allowedChats = db.collection('allowedChats');

  bot.command('allow', (ctx) => {
    if (ctx.chat.id !== process.env.BOT_OWNER_ID) {
      return ctx.reply('Sorry, only the bot owner can allow chat IDs.');
    }

    const parts = ctx.message.text.split(' ');
    if (parts.length !== 3) {
      return ctx.reply('Usage: /allow <id>');
    }

    const id = parseInt(parts[2], 10);
    if (isNaN(id)) {
      return ctx.reply('Error: Invalid ID');
    }

    allowedChats.insertOne({ chatId: id }, (insertErr) => {
      if (insertErr) {
        console.error(insertErr);
        return ctx.reply('Error: Failed to save chat ID to database.');
      }

      ctx.reply(`Chat ID ${id} is now allowed to use the bot.`);
    });
  });

  bot.command('mycommand', (ctx) => {
    allowedChats.findOne({ chatId: ctx.chat.id }, (findErr, result) => {
      if (findErr) {
        console.error(findErr);
        return ctx.reply('Error: Failed to check if chat ID is allowed.');
      }

      if (!result) {
        return ctx.reply('Sorry, you are not allowed to use this bot.');
      }

      // Add your bot's logic here
    });
  });
});



// Chat command

bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

const axios = require("axios");


  if (text) {
    ctx.sendChatAction("typing");
    const res = await getChat(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  
    //  reply("Please ask anything after /ask");
  }
});



bot.launch();
