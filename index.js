const express = require("express");
const axios = require("axios");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const app = express();

app.use(express.json());

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
    event: { channel, text, subtype }
  } = req.body;
  if (subtype && subtype === "bot_message") {
    res.sendStatus(200);
    return;
  }

  const url = "https://slack.com/api/chat.postMessage";
  await axios.post(
    url,
    { channel, text },
    {
      headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` }
    }
  );
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("App listening on 3000");
});
