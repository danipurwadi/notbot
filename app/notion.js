import TelegramBot from "node-telegram-bot-api";
import moment from "moment";
import * as notion from "../client/notion-client.js"
import * as utils from "./utils.js"

const token = process.env.TELEGRAM_TOKEN
let notbot;

if (process.env.NODE_ENV === 'production') {
  // use webhooks
  notbot = new TelegramBot(token);
  notbot.setWebHook(process.env.HEROKU_URL + notbot.token);
  console.log('**** BOT initiated ***** ');
} else {
  // use polling
  notbot = new TelegramBot(token, { polling: true });
}

notbot.on('message', async (msg) => {
  const input = msg.text.split(" ");

  switch (input[0]) {
    case '/start':
      notbot.sendMessage(msg.chat.id, "Welcome to Notion Bot! Type /help to get more info");
      break;
    case '/help':
      notbot.sendMessage(msg.chat.id, "`/list` Lists all tasks that are due today\n`/new <project> <urgency> <title>");
      break;
    case '/list' || '/all':

      const tasks = input[0] == '/list' ? await notion.getTasksDueToday() : await notion.getAllTasks();
      for (const task of tasks) {
        const status = task.properties.Status.status?.name || "Not Started"
        const urgencyEmoji = task.properties.Urgency.select?.color || "white"
        const dateTime = moment(task.properties.Deadline.date.start)
        const dateComponent = dateTime.format('DD-MM-YYYY');

        await notbot.sendMessage(msg.chat.id, `${task.icons ? task.icon.emoji : ""} ${task.properties.Name.title[0].plain_text}\n` +
          `${utils.URGENCY[urgencyEmoji]} [${task.properties.Project.select ? task.properties.Project.select.name : ""}] ${task.properties.Urgency.select?.name}\n` +
          `Deadline: ${dateComponent} \n\n` +
          `Status: ${status}\n\n` +
          `${task.url}`);
      }
      break;
    case '/update':
      const taskName = input[1]
      const status = input[2]
      notbot.sendMessage(msg.chat.id, "Update successful!");
      break;
    case '/new':
      const project = input[1]
      const urgency = input[2]
      const title = input.slice(3).join(" ")
      const icon = await notion.getProjectIcon(project);
      const tasksDatabase = await notion.getDatabase("Tasks");
      const databaseID = tasksDatabase[0].id;

      const response = await notion.createPage(databaseID, icon, title, project, urgency);

      if (response) {
        notbot.sendMessage(msg.chat.id, "Created page successfully!");
      } else {
        notbot.sendMessage(msg.chat.id, "Failed to create page");
      }
      break;
    default:
      notbot.sendMessage(msg.chat.id, "Unrecognized command, type /help to get more info");
  }
});

export default notbot;