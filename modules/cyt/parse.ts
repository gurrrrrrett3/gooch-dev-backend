import { parse } from "node-html-parser";
import { Town, MarkerIconData } from "../util/types";

export default class CYTParse {
  public static parseIcon(data: MarkerIconData, world: string): Town {
    let town: Town = {
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

    const popupData = parse(data.popup).rawText.split("\n");

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

      if (town.assistants == ["None"]) {
        town.assistants = [];
      }

    return town;
  }
}
