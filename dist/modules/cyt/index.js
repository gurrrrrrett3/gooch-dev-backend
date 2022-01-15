"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_1 = __importDefault(require("./update"));
class CYT {
    constructor(delay = 10000) {
        this.interval = setInterval(() => {
            this.update();
        }, delay);
    }
    static Start() {
        this.instance = new CYT();
        this.instance.update();
    }
    Stop() {
        clearInterval(this.interval);
    }
    update() {
        update_1.default.startUpdate();
    }
}
exports.default = CYT;
