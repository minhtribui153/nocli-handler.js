"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var chalk_1 = __importDefault(require("chalk"));
var log = function (name, type) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (type === "error")
        return console.log(chalk_1.default["red"]("[".concat(name, "]")), args.join(" "));
    else if (type === "warn")
        return console.log(chalk_1.default["yellow"]("[".concat(name, "]")), args.join(" "));
    else
        return console.log(chalk_1.default["blue"]("[".concat(name, "]")), args.join(" "));
};
exports.log = log;
