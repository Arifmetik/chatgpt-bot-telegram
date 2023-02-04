const Telegraf = require('telegraf');
const mongoose = require('mongoose');
const { reply } = require('telegraf/command-parts');
require('dotenv').config();

const bot = new Telegraf(process.env.TG_API);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error(error));

const allowedUserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
});

const AllowedUser = mongoose.model('AllowedUser', allowedUserSchema);

bot.command('allow', async (ctx) => {
  const userId = ctx.message.text.split(' ')[1];
  if (!userId) {
    return ctx.reply('Please provide a valid user ID after the /allow command.');
  }

  try {
    const allowedUser = new AllowedUser({ userId });
    await allowedUser.save();
    ctx.reply(`User with ID ${userId} has been granted permission to use the /ask command.`);
  } catch (error) {
    ctx.reply('Error while granting permission. Please try again.');
  }
});

bot.command('ask', async (ctx) => {
  const userId = ctx.from.id;
  const isAllowed = await AllowedUser.findOne({ userId });

  if (!isAllowed) {
    return ctx.reply('You are not allowed to use the /ask command. Please contact the bot owner for permission.');
  }

  // Your code to handle the /ask command here
});

bot.launch();
