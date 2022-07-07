import TelegramBot from "node-telegram-bot-api";
import * as notion from "../client/notion-client.js"
import * as utils from "./utils.js"

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
      notbot.sendMessage(msg.chat.id, "Welcome to Notion Bot! Press /help to get more info");
      break;
    case '/help':
      notbot.sendMessage(msg.chat.id, "No help can be found");
      break;
    case '/list':
      const tasks = await notion.getTasksDueToday();
      tasks.forEach((task) => {
        console.log(task.properties.Status)
        notbot.sendMessage(msg.chat.id, `${task.icon.emoji} ${task.properties.Name.title[0].plain_text}\n` +
          `${utils.urgency[task.properties.Urgency.select.color]} ${task.properties.Urgency.select.name}\n` +
          `Deadline: ${task.properties.Deadline.date.start.split("-").reverse().join("-")} \n\n` +
          `Status: ${task.properties.Status.status.name}\n\n` +
          `${task.url}`);
      })
      break;
    default:
      notbot.sendMessage(msg.chat.id, "Unrecognized command, type /help to get more info");
  }
});

export default notbot;