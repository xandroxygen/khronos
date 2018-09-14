const axios = require("axios");

const slackAPI = axios.create({
  baseURL: "https://slack.com/api/",
  headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` }
});

const postMessage = async data => {
  return await slackAPI.post("chat.postMessage", data);
};

const changeStatus = async ({
  user,
  status_emoji,
  status_text,
  status_expiration = 0
}) => {
  return await slackAPI.post(
    "users.profile.set",
    {
      profile: { status_emoji, status_text, status_expiration }
    },
    { headers: { "X-Slack-User": user } }
  );
};

module.exports = {
  postMessage,
  changeStatus
};
