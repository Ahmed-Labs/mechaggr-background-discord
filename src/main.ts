import * as dotenv from "dotenv";
dotenv.config();
const { Client } = require("discord.js-selfbot-v13");

const client = new Client({
  checkUpdate: false,
});


const channelId = "1084998986244558951"; 
const authToken = process.env.DISCORD_TOKEN; 

client.on("ready", async () => {
  console.log("Bot is online!");
});

client.on("message", (message: any) => {
  if (message.channelId === channelId) {
    console.log(
      `${message.createdTimestamp} | New message from ${message.author.username}#${message.author.discriminator}: ${message.content}`
    );

    // Store the data in a database or file here
  }
});

client.login(authToken);
