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

//Translate uzbek-english command

bot.command("tr_uz", async (ctx) => {
  const text = ctx.message.text?.replace("/tr_uz", "")?.trim().toLowerCase();

  if (text) {
    ctx.sendChatAction("typing");
    // Call a translation API or implement your own translation logic here
    const translatedText = await translateUzbekToEnglish(text);
    ctx.telegram.sendMessage(ctx.message.chat.id, translatedText, {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please provide text to translate after /tr_uz",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});

bot.command("tr_eng", async (ctx) => {
  const text = ctx.message.text?.replace("/tr_eng", "")?.trim().toLowerCase();

  if (text) {
    ctx.sendChatAction("typing");
    // Call a translation API or implement your own translation logic here
    const translatedText = await translateEnglishToUzbek(text);
    ctx.telegram.sendMessage(ctx.message.chat.id, translatedText, {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please provide text to translate after /tr_eng",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
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
