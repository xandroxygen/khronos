if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const bodyParser = require("body-parser");
const api = require("./api");
const app = express();

app.use(bodyParser.json(), bodyParser.urlencoded());

app.get("/", (req, res, next) => {
  res.send("Privet Mir!");
});

app.post("/", async (req, res, next) => {
  const { type } = req.body;
  if (type === "url_verification") {
    res.send(req.body.challenge);
    return;
  }

  const {
    event: { text, subtype, type: eventType, user }
  } = req.body;
  if (eventType === "message") {
    if (subtype && subtype === "bot_message") {
      res.sendStatus(200);
      return;
    }

    await api.changeStatus({
      status_emoji: ":raised_hands:",
      status_text: text,
      user
    });
  }
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("App listening on 3000");
});
