if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const bodyParser = require("body-parser");
const scheduler = require("node-schedule");
const { updateStatus } = require("./updateJob");
const scheduleMock = require("./schedule");
const app = express();

const schedules = {};

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
  }
  if (text.includes("set schedule")) {
    schedules[user] = {
      id: user,
      ...scheduleMock
    };
  }
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("App listening on 3000");
  scheduler.scheduleJob("* 0 * * * *", async () => {
    await updateStatus(schedules);
  });
  scheduler.scheduleJob("* 30 * * * *", async () => {
    await updateStatus(schedules);
  });
});
