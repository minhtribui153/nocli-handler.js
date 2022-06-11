"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const log = (name, type, ...args) => {
    if (type === "error")
        return console.log(chalk_1.default["red"](`[${name}]`), args.join(" "));
    else if (type === "warn")
        return console.log(chalk_1.default["yellow"](`[${name}]`), args.join(" "));
    else
        return console.log(chalk_1.default["blue"](`[${name}]`), args.join(" "));
};
exports.log = log;
