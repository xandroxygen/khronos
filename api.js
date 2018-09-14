const axios = require("axios");

const slackAPI = axios.create({
  baseURL: "https://slack.com/api/",
  headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` }
});

const postMessage = async data => {
  return await slackAPI.post("chat.postMessage", data);
};

module.exports = {
  postMessage
};
