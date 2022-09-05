import Command from "../command-handler/Command";

export default (commands: Map<string, Command>, guildId?: string | null | undefined, defaultCommands: boolean = false): string[] => {
    const originalCommands: string[] = [];
    commands.forEach((command) => {
        if (command.isAnAlias) return;
        else if (command.commandObject.testOnly && guildId) {
            // Check if guild is a test guild
            if (!command.instance.testServers.includes(guildId)) return;
        }
        else if (defaultCommands) {
            if (!command.isDefaultCommand) return;
        } else {
            if (command.isDefaultCommand) return;
        }

        return originalCommands.push(command.commandName);
    })
    return [...originalCommands]
}