const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

app.command("/botpersonnal-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/botpersonnal-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/botpersonnal-ping - Check bot latency;
/botpersonnal-coinflip - Flip a coin;
/botpersonnal-github USER - Get GitHub information about user.`
  });
});

app.command("/botpersonnal-coinflip", async ({ ack, respond }) => {
  await ack();
  const coin_face = getRandomInt(2) % 2 == 0 ? "heads" : "tails";
  await respond({ text: `The coin landed on ${coin_face} !`});
});

app.command("/botpersonnal-github", async ({ command, ack, respond }) => {
  await ack();

  const username = command.text.trim();
  
  if (!username) {
    await respond("Please provide a GitHub username.");
    return;
  };

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);

    const user = response.data;

    await respond({
      text:`GitHub profile: ${user.login}
Repositories: ${user.public_repos}
Followers: ${user.followers}
Following: ${user.following}`
    });
  } catch (err) {
    await respond("GitHub user not found.")
  };
});

app.command("/botpersonnal-")