import * as dotenv from "dotenv";
dotenv.config();
const { Client } = require("discord.js-selfbot-v13");
import { PrismaClient } from "@prisma/client";
const config = require("../config.json");

const prisma = new PrismaClient();
const authToken = process.env.DISCORD_TOKEN;

type discordMessageType = {
  content: string;
  author: string;
  postType: string;
  dateCreated: Date;
  serverName: string;
  channelName: string;
};
const client = new Client({
  checkUpdate: false,
});

async function processMessage(message: discordMessageType) {
  try {
    await prisma.discordMessage.create({
      data: message,
    });
  } catch (error) {
    console.error(`Error adding message to mongodb: ${error}`);
  }
}

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    client.on("ready", async () => {
      console.log("Bot is online!");
    });

    client.on("messageCreate", async (message: any) => {
      for (const server of config.servers) {
        for (const channel of server.channels) {
          if (channel.channelID == message.channelId) {
            const postTypeRegex = /\b(wts|wtt|wttf)\b/i;

            const messageInfo = {
              content: message.content,
              author:
                message.author.username + "#" + message.author.discriminator,
              postType: postTypeRegex.test(message.content)
                ? "Selling"
                : "Buying",
              dateCreated: new Date(message.createdTimestamp),
              serverName: server.name,
              channelName: channel.name,
            };
            console.log(messageInfo);
            await processMessage(messageInfo);
          }
        }
      }
    });

    await client.login(authToken);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
//npx ts-node .\src\main.ts
