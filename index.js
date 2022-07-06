import 'dotenv/config';
import express from "express";
import notbot from "./app/notion.js"

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the Bot API.' });
});

app.post(`/${process.env.TELEGRAM_TOKEN}`, (req, res) => {
  notbot.processUpdate(req.body);
  res.status(200).json({ message: 'ok' });
});

app.listen(port, () => {
  console.log(`\nServer running on port ${port}.\n`);
});
