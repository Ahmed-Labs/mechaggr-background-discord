"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const { Client } = require("discord.js-selfbot-v13");
const client_1 = require("@prisma/client");
const config = require("../config.json");
const prisma = new client_1.PrismaClient();
const authToken = process.env.DISCORD_TOKEN;
const client = new Client({
    checkUpdate: false,
});
function processMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.discordMessage.create({
                data: message,
            });
        }
        catch (error) {
            console.error(`Error adding message to mongodb: ${error}`);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log("Connected to database");
            client.on("ready", () => __awaiter(this, void 0, void 0, function* () {
                console.log("Bot is online!");
            }));
            client.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
                for (const server of config.servers) {
                    for (const channel of server.channels) {
                        if (channel.channelID == message.channelId) {
                            const postTypeRegex = /\b(wts|wtt|wttf)\b/i;
                            const messageInfo = {
                                content: message.content,
                                author: message.author.username + "#" + message.author.discriminator,
                                postType: postTypeRegex.test(message.content)
                                    ? "Selling"
                                    : "Buying",
                                dateCreated: new Date(message.createdTimestamp),
                                serverName: server.name,
                                channelName: channel.name,
                            };
                            console.log(messageInfo);
                            yield processMessage(messageInfo);
                        }
                    }
                }
            }));
            yield client.login(authToken);
        }
        catch (error) {
            console.log(`Error: ${error}`);
        }
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
//npx ts-node .\src\main.ts
