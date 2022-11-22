"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_files_1 = __importDefault(require("./get-all-files"));
const import_file_1 = __importDefault(require("./import-file"));
const handle_error_1 = __importDefault(require("../functions/handle-error"));
class FeatureHandler {
    _suffix;
    constructor(instance, featuresDir, client, language) {
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this.readFiles(instance, featuresDir, client).catch((err) => {
            const error = err;
            const showFullErrorLog = instance.debugging !== undefined ? instance.debugging.showFullErrorLog : false;
            (0, handle_error_1.default)(error, showFullErrorLog);
        });
    }
    async readFiles(instance, featuresDir, client) {
        const files = (0, get_all_files_1.default)(featuresDir);
        for (const file of files) {
            if (file.endsWith(this._suffix)) {
                const func = this._suffix === "js"
                    ? require(file)
                    : (0, import_file_1.default)(file);
                if (this.isFeature(func)) {
                    await func(instance, client);
                }
            }
        }
    }
    isFeature(object) {
        return object instanceof Function && Object.prototype.hasOwnProperty.call(object, "instance") && Object.prototype.hasOwnProperty.call(object, "client");
    }
}
exports.default = FeatureHandler;
