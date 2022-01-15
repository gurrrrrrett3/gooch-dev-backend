"use strict";
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
const path_1 = __importDefault(require("path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const defaultFiles_json_1 = __importDefault(require("./data/defaultFiles.json"));
const filelist_json_1 = __importDefault(require("./data/filelist.json"));
const fetchData_json_1 = __importDefault(require("./data/fetchData.json"));
class CytUpdate {
    static startUpdate() {
        this.checkForFiles();
        this.downloadFiles();
    }
    static checkForFiles() {
        defaultFiles_json_1.default.data.forEach((file) => {
            if (!fs_1.default.existsSync(path_1.default.resolve(defaultFiles_json_1.default.filePath, file.location + file.name))) {
                fs_1.default.writeFileSync(path_1.default.resolve(defaultFiles_json_1.default.filePath, file.location + file.name), JSON.stringify(file.data));
            }
        });
    }
    static downloadFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            globalThis.navigator = globalThis.navigator || {};
            //@ts-ignore
            navigator.cookieEnabled = true;
            filelist_json_1.default.data.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield (0, node_fetch_1.default)(filelist_json_1.default.baseURL + file.url, fetchData_json_1.default);
                    const data = yield res.json();
                    fs_1.default.writeFileSync(path_1.default.resolve(filelist_json_1.default.filePath, file.fileLocation + file.filename), JSON.stringify(data, null, 2));
                }
                catch (error) {
                    try {
                        const res = yield (0, node_fetch_1.default)(filelist_json_1.default.baseURL + file.url, {
                            method: "GET",
                            headers: fetchData_json_1.default.headers
                        });
                        const data = yield res.text();
                        fs_1.default.writeFileSync(path_1.default.resolve(filelist_json_1.default.filePath, "errors/" + file.filename.replace("json", "html")), data);
                        console.log(`Error downloading file, check errors folder | ${file.filename}`);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }));
        });
    }
}
exports.default = CytUpdate;
