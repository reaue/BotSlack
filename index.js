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
/botpersonnal-github USER - Get GitHub information about user;
/botpersonnal-qr DATA - Create a Qr code encoding your data.`
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
    await respond("GitHub user not found.");
  };
});

app.command("/botpersonnal-qr", async ({ command, ack, respond }) => {
  await ack();

  const data = command.text.trim();

  if (!data) {
    await respond("Please provide data to put in the Qr code.");
    return;
  }

  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;

    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*QR code for:* ${data}`
        }
      },
      {
        type: "image",
        image_url: qrUrl,
        alt_text: `QR code for ${data}`
      }
    ];
  } catch (err) {
    await respond("Some issues occured with the Qr code API.");
  }
});