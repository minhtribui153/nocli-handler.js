"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const handleColorType = (type) => {
    switch (type) {
        case 'info':
            return "blue";
        case 'warn':
            return "yellow";
        case 'error':
            return "red";
    }
};
const log = (name, type, ...args) => {
    const time = new Date().toLocaleTimeString();
    const color = handleColorType(type);
    const infoType = `[${name}]`;
    const timeType = `[${time}]`;
    console.log(chalk_1.default.bold["grey"](timeType) + chalk_1.default.bold[color](infoType), args.join(" "));
    return;
};
exports.log = log;
