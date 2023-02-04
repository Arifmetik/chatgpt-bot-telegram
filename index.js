const { MongoClient } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGODB_URI;
const botOwnerId = process.env.BOT_OWNER_ID;

require('dotenv').config();
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

if (uri && uri.startsWith('mongodb://')) {
  let db;

  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      console.log("Error connecting to MongoDB:", error);
    } else {
      console.log("Successfully connected to MongoDB");
      db = client.db("telegram-bot-db");
    }
  });

  bot.command("allow", (ctx) => {
    if (db) {
      if (ctx.from.id.toString() === botOwnerId) {
        const userId = ctx.message.text.split(" ")[1].replace("/", "");
        db.collection("allowed_users").insertOne({ user_id: userId }, (error, result) => {
          if (error) {
            console.log("Error adding user to allowed_users collection:", error);
          } else {
            ctx.reply(`User with ID ${userId} has been granted access to /ask command`);
          }
        });
      } else {
        ctx.reply("You are not the bot owner");
      }
    } else {
      ctx.reply("Error connecting to MongoDB, cannot perform this action");
    }
  });

  bot.command("ask", (ctx) => {
    if (db) {
      db.collection("allowed_users").findOne({ user_id: ctx.from.id.toString() }, (error, result) => {
        if (error) {
          console.log("Error searching for user in allowed_users collection:", error);
        } else if (result) {
          // logic for handling the /ask command
        } else {
          ctx.reply("You do not have permission to use the /ask command");
        }
      });
    } else {
      ctx.reply("Error connecting to MongoDB, cannot perform this action");
    }
  });
}

bot.launch();
