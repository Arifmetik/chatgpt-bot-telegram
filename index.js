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






// Chat command

bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

const axios = require("axios");

async function translateText(text, targetLanguage = "uz") {
  const encodedText = encodeURI(text);
  const response = await axios.get(
    https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodedText}
  );

  return response.data[0][0][0];
}

// Example usage
async function handleTranslation(ctx) {
  const text = ctx.message.text?.replace("/translate", "")?.trim().toLowerCase();
  if (text) {
    const translatedText = await translateText(text);
    ctx.telegram.sendMessage(ctx.message.chat.id, translatedText, {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please provide text to translate after /translate",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
}

bot.command("translate", handleTranslation);


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
