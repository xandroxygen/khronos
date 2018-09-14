if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const api = require("./api");

const users = {};

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/add-to-slack.html");
});

app.post("/", async (req, res, next) => {
  const { type } = req.body;
  if (type === "url_verification") {
    res.send(req.body.challenge);
    return;
  }

  const {
    event: { channel, text, subtype, type: eventType, user }
  } = req.body;
  console.log(req.body.event);
  if (eventType === "message") {
    if (subtype && subtype === "bot_message") {
      res.sendStatus(200);
      return;
    }

    const { data } = await api.postMessage({ channel, text });
    console.log(data);
  }
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("App listening on 3000");
});
