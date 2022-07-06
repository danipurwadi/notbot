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
  console.log(token)
  notbot = new TelegramBot(token, { polling: true });
}

notbot.on('message', async (msg) => {
  const input = msg.text;
  switch (msg.text) {
    case '/start':
      notbot.sendMessage(msg.chat.id, "Welcome to Notion Bot!");
    case '/help':
      notbot.sendMessage(msg.chat.id, "Welcome to Notion Bot!");
    default:
      notbot.sendMessage(msg.chat.id, "Unrecognized command, type /help to know more");
  }
});

export default notbot;