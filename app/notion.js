import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_TOKEN
let notbot;

if (process.env.NODE_ENV === 'production') {
  // use webhooks
  notbot = new TelegramBot(token);
  notbot.setWebHook(process.env.HEROKU_URL + bot.token);
  console.log('**** BOT initiated ***** ');
} else {
  // use polling
  notbot = new TelegramBot(token, { polling: true });
}

notbot.on('message', async (msg) => {
  const input = msg.text;
  switch (input) {
    case '/start':
      notbot.sendMessage(msg.chat.id, "Welcome to Notion Bot!");
      break;
    case '/help':
      notbot.sendMessage(msg.chat.id, "No help can be found");
      break;
    default:
      notbot.sendMessage(msg.chat.id, "Unrecognized command, type /help to know more");
  }
});

export default notbot;