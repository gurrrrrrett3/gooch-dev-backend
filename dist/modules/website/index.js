"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mainRouter_1 = __importDefault(require("./routers/mainRouter"));
const App = (0, express_1.default)();
App.use("/", mainRouter_1.default);
class Website {
    static Start() {
        App.listen(80, () => {
            console.log("Website started on port 80");
        });
    }
    static Stop() {
        console.log("Website cannot be stopped");
    }
}
exports.default = Website;
