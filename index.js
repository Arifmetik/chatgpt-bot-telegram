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


// Test commands

bot.command('connectdb', (ctx) => {
  // Connect to the database here and check if the connection was successful
  if (successful) {
    ctx.reply('Connected');
  } else {
    ctx.reply('Error');
  }
});

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error(`Error connecting to the database: ${error}`);
});

db.once("open", () => {
  console.log("Connected to the database.");
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
