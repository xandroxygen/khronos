if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const bodyParser = require("body-parser");
const api = require("./api");
const app = express();

const schedules = [
  {
    id: "UCTT1LAE7",
    defaultStatus: { status_text: "afk", status_emoji: ":house:" },
    1: [
      {
        status_text: "at the office, 8:30-12:30",
        status_emoji: ":office:",
        start_time: "8:30AM",
        end_time: "12:30PM"
      },
      {
        status_text: "in transit",
        status_emoji: ":bus:",
        start_time: "12:30PM",
        end_time: "2:00PM"
      },
      {
        status_text: "do not disturb, 2-5",
        status_emoji: ":school_satchel:",
        start_time: "2:00PM",
        end_time: "5:00PM"
      }
    ],
    2: [
      {
        status_text: "in class, on Slack, 8-11",
        status_emoji: ":school_satchel:",
        start_time: "8:00AM",
        end_time: "11:00AM"
      },
      {
        status_text: "wfh, 11-4",
        status_emoji: ":house:",
        start_time: "11:00AM",
        end_time: "4:00PM"
      },
      {
        status_text: "do not disturb",
        status_emoji: ":school_satchel:",
        start_time: "4:00PM",
        end_time: "5:00PM"
      }
    ],
    3: [
      {
        status_text: "at the office, 8:30-2:30",
        status_emoji: ":office:",
        start_time: "8:30AM",
        end_time: "2:30PM"
      },
      {
        status_text: "in transit",
        status_emoji: ":bus:",
        start_time: "2:30PM",
        end_time: "4:00PM"
      },
      {
        status_text: "do not disturb",
        status_emoji: ":school_satchel:",
        start_time: "4:00PM",
        end_time: "5:00PM"
      }
    ],
    4: [
      {
        status_text: "in class, on Slack, 8-11",
        status_emoji: ":school_satchel:",
        start_time: "8:00AM",
        end_time: "11:00AM"
      },
      {
        status_text: "wfh, 11-3",
        status_emoji: ":house:",
        start_time: "11:00AM",
        end_time: "3:30PM"
      },
      {
        status_text: "do not disturb",
        status_emoji: ":school_satchel:",
        start_time: "3:30PM",
        end_time: "6:00PM"
      }
    ],
    5: [
      {
        status_text: "at the office, 8:30-5",
        status_emoji: ":office:",
        start_time: "8:30AM",
        end_time: "5:00PM"
      }
    ]
  }
];

const isTimeMatch = (one, two) => {
  return (
    one.getHours() === two.getHours() &&
    Math.abs(one.getMinutes() - two.getMinutes()) < 5
  );
};

const parseTime = time => {
  const regex = /(\d{1,2}):(\d{2})(am|pm|a|p)/i;
  const [_, hour, minute, am] = time.match(regex);
  const date = new Date();
  const isAM = am.toLowerCase().includes("a");
  date.setHours(isAM ? hour : parseInt(hour) + 12);
  date.setMinutes(minute);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const checkStatus = async () => {
  const now = new Date();
  now.setHours(8); // hand-set for testing
  now.setMinutes(30); // hand-set for testing
  for (const user of schedules) {
    const schedule = user[now.getDay()];
    const defaultStatus = user.defaultStatus;
    for (const {
      status_text,
      status_emoji,
      start_time,
      end_time
    } of schedule) {
      if (isTimeMatch(parseTime(end_time), now)) {
        await api.changeStatus({
          status_text: defaultStatus.status_text,
          status_emoji: defaultStatus.status_emoji,
          user: user.id
        });
      } else if (isTimeMatch(parseTime(start_time), now)) {
        await api.changeStatus({
          status_text: status_text,
          status_emoji: status_emoji,
          user: user.id
        });
      }
    }
  }
};

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

    await checkStatus();
  }
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("App listening on 3000");
});
