if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const bodyParser = require("body-parser");
const api = require("./api");

const users = {};

const app = express();

app.use(bodyParser.json(), bodyParser.urlencoded());

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/add-to-slack.html");
});

app.post("/actions", async (req, res, next) => {
  const payload = JSON.parse(req.body.payload);
  console.log(payload);

  if (payload.callback_id === "status") {
    const {
      user: { id: user_id },
      trigger_id,
      token
    } = payload;
    const { data } = await api.requestPermissions({
      trigger_id,
      user: user_id,
      scopes: "users.profile:write:user",
      token
    });
    console.log(data);
  }
  res.sendStatus(200);
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
  console.log(req.body.event.user);
  if (eventType === "message") {
    if (subtype && subtype === "bot_message") {
      res.sendStatus(200);
      return;
    }

    const { data } = await api.changeStatus({
      status_emoji: ":raised_hands:",
      status_text: text,
      user
    });
    console.log(data);
  }
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("App listening on 3000");
});
