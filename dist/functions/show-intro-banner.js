"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const chalk_1 = __importDefault(require("chalk"));
const node_banner_1 = __importDefault(require("node-banner"));
exports.default = async (version) => {
    console.clear();
    await (0, node_banner_1.default)("NoCliHandler.JS", version, "green", "red");
    console.log(chalk_1.default.bold.magenta(" NodeJS Version: " + process.version));
    console.log(chalk_1.default.bold.blueBright(` Discord.JS Handler Version: ${discord_js_1.default.version}`));
    console.log(chalk_1.default.bold.cyan(" Github Repo: https://github.com/tribui141108/nocli-handler.js"));
    console.log("\n");
    console.log(chalk_1.default.bold.magentaBright(" README: https://github.com/tribui141108/NoCli-Handler.js#readme"));
    console.log(chalk_1.default.bold.gray('================================================================'));
};
