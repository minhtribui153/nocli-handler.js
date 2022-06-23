import DiscordJS from 'discord.js';

export default (version: string): boolean => {
    return DiscordJS.version === version;
}