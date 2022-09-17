import { AutocompleteInteraction, Events, InteractionType } from "discord.js";
import Command from "../../../../command-handler/Command";
import NoCliCommandError from "../../../../errors/NoCliCommandError";
import handleError from "../../../../functions/handle-error";
import { IEvent } from "../../../../types";

const handleAutocomplete = async (interaction: AutocompleteInteraction, commands: Map<string, Command>) => {
    const command = commands.get(interaction.commandName);
    if (!command) return;

    const { autocomplete } = command.commandObject
    if (!autocomplete) return;

    const focusedOption = interaction.options.getFocused(true);
    const choices = await autocomplete(interaction, command, focusedOption.name);

    for (const choice of choices) {
        if (typeof choice !== "string") throw new NoCliCommandError("Some autocomplete options are not a string");
    }

    const filtered = choices.filter((choice) => choice.toLowerCase().startsWith(focusedOption.value.toLowerCase()));

    const editedFilter = []
    let counter = 0

    if (filtered.length > 25) {
        filtered.forEach(value => {
            if (counter === 25) return;
            counter += 1;
            return editedFilter.push(value);
        })
    } else editedFilter.push(...filtered)

    await interaction.respond(editedFilter.map(choice => ({ name: choice, value: choice })));
}

export default {
    description: "The Slash Commands handler",
    callback: async (instance, interaction) => {
        const { commandHandler } = instance;
        const { commands, customCommands } = commandHandler!;

        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            handleAutocomplete(interaction, commands).catch((err) => {
                if (err.name !== "NoCliCommandError") return;
                const showFullErrorLog = instance.debug ? instance.debug.showFullErrorLog : false;
                handleError(err as any, showFullErrorLog);
            });
            return
        }

        if (interaction.type !== InteractionType.ApplicationCommand) return;

        const args = interaction.options.data.map(({ value }) => String(value));

        const command = commands.get(interaction.commandName);
        if (!command) {
            customCommands.run(interaction.commandName, undefined, interaction);
            return;
        };

        const res = await commandHandler!.runCommand(command, args, null, interaction);
        if (!res) return;

        const { response, deferReply } = res;

        if (deferReply) interaction.followUp(response).catch(() => {});
        else interaction.reply(response).catch(() => {});
    
    }
} as IEvent<Events.InteractionCreate>