import CommandHandler from "./command-handler/CommandHandler";
import NoCliHandlerError from "./errors/NoCliHandlerError";
import mongoose from 'mongoose';
import showBanner from 'node-banner';

import { NoCliHandlerOptions } from "./types";
import { log } from "./functions/log";


class NoCliHandler {
    public options: NoCliHandlerOptions;
    
    constructor(options: NoCliHandlerOptions) {
        this.options = options;
        this.main();
    }

    private async main() {
        // if (this.showBanner) {
        //     console.clear()
        //     await showBanner("NoCliHandler.JS", "Version 1.0.0", "green", "red")
        // }
        try {
            if (!this.options.client) throw new NoCliHandlerError("No client provided");
            this.options.client
                .setMaxListeners(Infinity)
                .on("ready", bot => log("NoCliHandler", "info", `Your bot ${bot.user.tag} is up and running`));

            if (this.options.commandsDir) {
                const commandHandlerInstance = new CommandHandler(this.options.commandsDir, this.options.language);
                commandHandlerInstance.messageListener(this.options.client);
            }
    
            this.options.mongoDB !== undefined
                ? this.connectToMongoDB(this.options.mongoDB)
                : log("NoCliHandler", "warn", "No mongoURI provided");
        } catch (err) {
            const error = err as any;
            log(error.name, "error", error.message);
            return process.exit(1);
        }
    }
    private connectToMongoDB(mongoDB: NoCliHandlerOptions["mongoDB"]) {
        const options = mongoDB!.options;
        mongoose.connect(mongoDB!.uri, options ? options : { keepAlive: true }, (err) => err
            ? log("NoCliHandler", "warn", "Error connecting to MongoDB: " + err)
            : log("NoCliHandler", "info", "Connected to MongoDB"));
    }
}
export default NoCliHandler;