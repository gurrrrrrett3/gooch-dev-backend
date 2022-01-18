"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filelist_json_1 = __importDefault(require("./data/filelist.json"));
const defaultFiles_json_1 = __importDefault(require("./data/defaultFiles.json"));
class CYTInterface {
    static getPlayerFile() {
        return JSON.parse(fs_1.default
            .readFileSync(path_1.default.resolve(filelist_json_1.default.filePath, filelist_json_1.default.files.players.fileLocation, filelist_json_1.default.files.players.filename), "utf8")
            .toString()).players;
    }
    static getTownFile() {
        return JSON.parse(fs_1.default
            .readFileSync(path_1.default.resolve(defaultFiles_json_1.default.filePath, defaultFiles_json_1.default.files.created.towns.location, defaultFiles_json_1.default.files.created.towns.name), "utf8")
            .toString());
    }
    static getPlayer(playerName) {
        const playerdata = this.getPlayerFile().find((player) => {
            return player.name.toLowerCase() === playerName.toLowerCase();
        });
        return playerdata;
    }
    static getOnlineCounts() {
        let playerData = this.getPlayerFile();
        let outData = {
            total: playerData.length,
            afk: 0,
            worlds: [],
        };
        this.getPlayerFile().forEach((player) => {
            if (player.x == 25 && player.z == 42) {
                outData.afk++;
            }
            if (!outData.worlds.find((world) => {
                return world.name == player.world;
            })) {
                outData.worlds.push({ name: player.world, count: 1 });
            }
            else {
                //@ts-ignore
                outData.worlds.find((world) => {
                    return world.name == player.world;
                }).count++;
            }
        });
        return outData;
    }
    static getTown(name) {
        const towns = this.getTownFile();
        const town = towns.find((town) => {
            return town.name.toLowerCase() === name.toLowerCase();
        });
        return town;
    }
    static getPlayerTown(playerName) {
        const player = this.getPlayer(playerName);
        const towns = this.getTownFile();
        const town = towns.find((town) => {
            return town.residents.includes(player.name);
        });
        return town;
    }
    static getOnlineTowns() {
        let players = this.getPlayerFile();
        let onlineTowns = [];
        players.forEach((player) => {
            const town = this.getPlayerTown(player.name);
            if (!town)
                return;
            const data = { town: town.name, online: 1 };
            if (!onlineTowns.find((town) => {
                return town.town === data.town;
            })) {
                onlineTowns.push(data);
            }
            else {
                //@ts-ignore
                onlineTowns.find((town) => {
                    return town.town === data.town;
                }).online++;
            }
        });
        return onlineTowns;
    }
}
exports.default = CYTInterface;
