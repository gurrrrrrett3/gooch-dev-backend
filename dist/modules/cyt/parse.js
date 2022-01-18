"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_html_parser_1 = require("node-html-parser");
class CYTParse {
    static parseIcon(data, world) {
        let town = {
            name: "",
            world: world,
            mayor: "",
            pvp: false,
            residents: [],
            assistants: [],
            coords: {
                x: 0,
                z: 0,
            },
        };
        town.coords = data.point;
        const popupData = (0, node_html_parser_1.parse)(data.popup).rawText.split("\n");
        town.name = popupData[2].trim().replace(/ \(.+\)/g, "");
        town.mayor = popupData[5].trim();
        town.assistants = popupData[8]
            .trim()
            .split(",")
            .map((r) => r.trim());
        town.pvp = popupData[11].trim() == "true" ? true : false;
        town.residents = popupData[13]
            .trim()
            .replace("Residents: ", "")
            .split(",")
            .map((r) => r.trim());
        return town;
    }
}
exports.default = CYTParse;
