const api = require("./api");

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

const updateStatus = async schedules => {
  const now = new Date();
  now.setHours(8); // hand-set for testing
  now.setMinutes(30); // hand-set for testing
  for (const [_, user] of Object.entries(schedules)) {
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

module.exports = {
  updateStatus
};
