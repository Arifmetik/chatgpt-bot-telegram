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

const axios = require("axios");

async function translateUzbekToEnglish(text) {
  try {
    const response = await axios.get(`https://translate.google.com/#view=home&op=translate&sl=uz&tl=en&text=${text}`);
    // Extract the translation from the response using a library like cheerio
    const $ = require("cheerio").load(response.data);
    const translatedText = $("#result_box span").text();
    return translatedText;
  } catch (error) {
    console.error(error);
    return "Could not translate text at this time.";
  }
}

async function translateEnglishToUzbek(text) {
  try {
    const response = await axios.get(`https://translate.google.com/#view=home&op=translate&sl=en&tl=uz&text=${text}`);
    // Extract the translation from the response using a library like cheerio
    const $ = require("cheerio").load(response.data);
    const translatedText = $("#result_box span").text();
    return translatedText;
  } catch (error) {
    console.error(error);
    return "Could not translate text at this time.";
  }
}




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
