import NoCliHandler from "..";
import NoCliCommandError from "../errors/NoCliCommandError";
import cooldownSchema from "../models/cooldown-schema";
import { cooldownTypesArray, NoCliCooldownKeyOptions, NoCliCooldownOptions, NoCliCooldownType } from "../types";

const cooldownDurations = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24
} as const;

/** Sets cooldowns for the database and the bot */
class Cooldowns {

    private _cooldowns = new Map<string, Date>();
    private _instance: NoCliHandler;
    private _errorMessage: string
    private _botOwnersBypass: boolean;
    private _dbRequired: number;


    constructor(options: NoCliCooldownOptions) {
        const {
            instance,
            errorMessage = "Please wait [TIME] before trying again",
            botOwnersBypass = false,
            dbRequired = 300 // 5 minutes
        } = options;
        this._instance = instance;
        this._errorMessage = errorMessage;
        this._botOwnersBypass = botOwnersBypass;
        this._dbRequired = dbRequired;

        this.loadCooldowns();
    }

    /** Loads all cooldowns from the database */
    async loadCooldowns() {
        await cooldownSchema.deleteMany({
            expires: { $lt: new Date() }
        });

        const cooldowns = await cooldownSchema.find({});


        for (const cooldown of cooldowns) {
            const { _id, expires } = cooldown;
            this._cooldowns.set(_id, expires);
        }
    }

    getKeyFromCooldownUsage(options: NoCliCooldownKeyOptions) {
        const { cooldownType, userId, actionId, guildId } = options;

        return this.getKey(cooldownType, userId, actionId, guildId);
    }

    async cancelCooldown(cooldownUsage: NoCliCooldownKeyOptions) {
        const key = this.getKeyFromCooldownUsage(cooldownUsage);

        this._cooldowns.delete(key);

        await cooldownSchema.deleteOne({ _id: key });
    }

    async updateCooldown(cooldownUsage: NoCliCooldownKeyOptions, expires: Date) {
        const key = this.getKeyFromCooldownUsage(cooldownUsage);

        this._cooldowns.set(key, expires);

        const now = new Date();
        const secondsDiff = (expires.getTime() - now.getTime()) / 1000

        if (secondsDiff > this._dbRequired) {
            await cooldownSchema.findOneAndUpdate(
                {
                    _id: key
                }, 
                {
                    _id: key,
                    expires
                },
                {
                    upsert: true
                },
            )
        }
    }

    /** Verifies the cooldown duration */
    verifyCooldown(duration: string | number) {
        if (typeof duration === "number") return duration;

        // 10 m
        // ['10', 'm']
        const split = duration.split(' ');
        if (split.length !== 2) {
            throw new NoCliCommandError(`Duration "${duration}" is an invalid duration. Please use "10 m", "15 s" etc`)
        }

        const quantity = +split[0];
        const type = split[1].toLowerCase() as keyof typeof cooldownDurations;

        if (!cooldownDurations[type]) throw new NoCliCommandError(`Unknown duration type "${type}". Please use one of the following: ${Object.keys(cooldownDurations).join(', ')}`);

        if (quantity <= 0) throw new NoCliCommandError(`Invalid quantity of "${quantity}". Please use a value greater than 0.`)
        
        // @ts-ignore
        return quantity * cooldownDurations[type];
    }

    /** Gets the cooldown key */
    getKey(cooldownType: NoCliCooldownType, userId?: string, actionId?: string, guildId?: string): string {
        const isPerUser = cooldownType === cooldownTypesArray[0];
        const isPerUserPerGuild = cooldownType === cooldownTypesArray[1];
        const isPerGuild = cooldownType === cooldownTypesArray[2];
        const isGlobal = cooldownType === cooldownTypesArray[3];

        if ((isPerUserPerGuild || isPerGuild) && !guildId) throw new NoCliCommandError(`Invalid cooldown type "${cooldownType}" used outside of a guild`);
        if (isPerUser) return `${userId}-${actionId}`;
        if (isPerUserPerGuild) return `${userId}-${guildId}-${actionId}`;
        if (isPerGuild) return `${guildId}-${actionId}`;
        if (isGlobal) return actionId!;
        else return '';
    }

    /** Checks if user can bypass cooldown integrations */
    canBypass(userId: string) {
        return this._botOwnersBypass && this._instance.botOwners.includes(userId);
    }

    /** Starts the cooldown */
    async start(options: NoCliCooldownKeyOptions) {
        const {
            cooldownType,
            userId,
            actionId,
            guildId = '',
            duration
        } = options;
        const cooldownDuration = duration!;

        if (this.canBypass(userId)) return;
        
        if (!cooldownTypesArray.includes(cooldownType)) throw new NoCliCommandError(`Invalid cooldown type "${cooldownType}". Please use one of the following: ${cooldownTypesArray.join(', ')}`)
        
        const seconds = this.verifyCooldown(cooldownDuration);

        const key = this.getKey(cooldownType, userId, actionId, guildId);

        const expires = new Date()
        expires.setSeconds(expires.getSeconds() + seconds);
        
        if (seconds >= this._dbRequired) {
            await cooldownSchema.findOneAndUpdate(
                {
                    _id: key
                }, 
                {
                    _id: key,
                    expires
                },
                {
                    upsert: true
                },
            )
        }

        this._cooldowns.set(key, expires);
    }

    canRunAction(options: NoCliCooldownKeyOptions) {
        const {
            cooldownType,
            userId,
            actionId,
            guildId = '',
            errorMessage = this._errorMessage
        } = options;
        if (this.canBypass(userId)) return true;

        const key = this.getKey(cooldownType, userId, actionId, guildId);
        const expires = this._cooldowns.get(key);

        if (!expires) return true;

        const now = new Date();
        if (now > expires) {
            this._cooldowns.delete(key);
            return true;
        }

        const secondsDiff = (expires.getTime() - now.getTime()) / 1000;
        const d = Math.floor(secondsDiff / (3600 * 24));
        const h = Math.floor((secondsDiff % (3600 * 24)) / 3600);
        const m = Math.floor((secondsDiff % 3600) / 60);
        const s = Math.floor(secondsDiff % 60);

        let time = '';
        if (d > 0) time += `${d}d `;
        if (h > 0) time += `${h}h `;
        if (m > 0) time += `${m}m `;
        time += `${s}s`;

        return errorMessage.replace('[TIME]', time);
    }
}

export default Cooldowns;