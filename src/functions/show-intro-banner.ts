import DiscordJS from 'discord.js';
import chalk from 'chalk';
import showBanner from 'node-banner';


export default async (version: string) => {
    console.clear();
    await showBanner("NoCliHandler.JS", version, "green", "red");
    console.log(chalk.bold.magenta(" NodeJS Version: " + process.version));
    console.log(chalk.bold.blueBright(` Discord.JS Handler Version: ${DiscordJS.version}`));
    console.log(chalk.bold.cyan(" Github Repo: https://github.com/tribui141108/nocli-handler.js"));
    console.log("\n");
    console.log(chalk.bold.magentaBright(" README: https://github.com/tribui141108/NoCli-Handler.js#readme"));
    console.log(chalk.bold.red(" For errors relating to nocli-handler.js, please read https://github.com/tribui141108/nocli-handler.js/blob/master/docs/Errors.md"));
    console.log(chalk.bold.gray('================================================================'));
}