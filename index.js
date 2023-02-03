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
const { translate } = require('@google-cloud/translate').v2;
const axios = require("axios");

// Your Google Cloud API Key
const googleTranslateApiKey = process.env.GOOGLE_API;

// Initialize the translate API client
const translateClient = new translate({
  key: googleTranslateApiKey,
});

// Function to translate text from source to target language
const translateText = async (text, target) => {
  // Detect the source language
  const [detection] = await translateClient.detect(text);
  const source = detection.language;

  // Translate the text to target language
  const [translation] = await translateClient.translate(text, target);
  return { source, target, translation };
};

// Command to handle user messages
bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim();
  if (!text) {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  } else {
    ctx.sendChatAction("typing");

    // Translate the user's message to English
    const { source, target, translation: translatedText } = await translateText(text, 'en');

    // Get the response from OpenAI API in English
    const res = await getChat(translatedText);

    // Translate the response back to the user's language
    const { translation: translatedResponse } = await translateText(res, source);

    // Send the response to the user
    ctx.telegram.sendMessage(ctx.message.chat.id, translatedResponse, {
      reply_to_message_id: ctx.message.message_id,
    });
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
