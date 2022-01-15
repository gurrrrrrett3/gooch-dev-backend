"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const startList_json_1 = __importDefault(require("./util/data/startList.json"));
class StartModules {
    static startAll() {
        fs_1.default.readdirSync("./modules").forEach((folder) => __awaiter(this, void 0, void 0, function* () {
            if (!folder.includes(".") && startList_json_1.default.includes(folder)) {
                yield Promise.resolve().then(() => __importStar(require(`./${folder}/index.js`))).then((module) => {
                    console.log(`Starting module: ${folder}`);
                    module.default.Start();
                });
            }
        }));
    }
    static stopAll() {
        fs_1.default.readdirSync("./modules").forEach((folder) => __awaiter(this, void 0, void 0, function* () {
            if (!folder.includes(".") && startList_json_1.default.includes(folder)) {
                yield Promise.resolve().then(() => __importStar(require(`./${folder}/index.js`))).then((module) => {
                    console.log(`Stopping module: ${folder}`);
                    module.default.Stop();
                });
            }
        }));
    }
    static start(module) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve().then(() => __importStar(require(`./${module}/index.js`))).then((mod) => {
                console.log(`Starting module: ${module}`);
                mod.default.Start();
            });
        });
    }
    static stop(module) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve().then(() => __importStar(require(`./${module}/index.js`))).then((mod) => {
                console.log(`Stopping module: ${module}`);
                mod.default.Stop();
            });
        });
    }
}
exports.default = StartModules;
StartModules.modules = [];
