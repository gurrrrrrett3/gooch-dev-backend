import fs from "fs";
import path from "path";
import Util from "../util";
import Config from "../util/config";
import Logger from "../util/logger";
import { Player, Town } from "../util/types";
import defaultFiles from "./data/defaultFiles.json";
import logFiles from "./data/logFiles.json";

const teleportDistance = parseInt(Config.getValue("TeleportDistance"));

export default class TownLog {
  public static init() {
    //check for folders and files

    defaultFiles.logs.dirs.forEach((dir) => {
      if (!fs.existsSync(defaultFiles.filePath + dir)) {
        fs.mkdirSync(defaultFiles.filePath + dir);
      }
    });

    defaultFiles.logs.files.forEach((file) => {
        if (!fs.existsSync(defaultFiles.filePath + file)) {
            fs.writeFileSync(defaultFiles.filePath + file, "[]");
        }
        });
  }

  public static saveOldTowns() {
    
    if (!fs.existsSync(defaultFiles.filePath +
        defaultFiles.files.created.towns.location +
        defaultFiles.files.created.towns.name)) {
            Logger.log("Towns file not found, waiting while it is created...");
            return;
        }

    
    fs.copyFileSync(
      defaultFiles.filePath +
        defaultFiles.files.created.towns.location +
        defaultFiles.files.created.towns.name,
      defaultFiles.filePath + defaultFiles.logs.logFilePath + "towns.old.json"
    )
  }

  public static saveOldPlayers() {

    if (!fs.existsSync( defaultFiles.filePath +
        defaultFiles.files.downloaded.players.location +
        defaultFiles.files.downloaded.players.name)) {
            Logger.log("Players file not found, waiting while it is created...");
            return;
        }

    fs.copyFileSync(
      defaultFiles.filePath +
        defaultFiles.files.downloaded.players.location +
        defaultFiles.files.downloaded.players.name,
      defaultFiles.filePath + defaultFiles.logs.logFilePath + "players.old.json"
    );
  }

  private static updateTownData(oldTowns: Town[], town: Town) {
    const oldTown = oldTowns.find((oldTown) => {
      return oldTown.name === town.name;
    });

    if (!oldTown) {
      //Town Created
      this.addDataToFile(path.resolve(logFiles.path, logFiles.townRise, Util.genDateFilename() + ".json"), {
        date: Date.now(),
        name: town.name,
        data: town,
      });
      return;
    }

    if (oldTown.pvp !== town.pvp) {
      //Town PvP Changed
      this.addDataToFile(path.resolve(logFiles.path, logFiles.pvpToggle, town.name + ".json"), {
        date: Date.now(),
        name: town.name,
        state: town.pvp,
      });
    }

    if (oldTown.residents.length !== town.residents.length) {
      //Town Residents Changed

      if (oldTown.residents.length > town.residents.length) {
        //Town Residents Removed

        const residentsRemoved = oldTown.residents.filter((resident) => {
          return !town.residents.includes(resident);
        });

        this.addDataToFile(path.resolve(logFiles.path, logFiles.memberLeave, town.name + ".json"), {
          date: Date.now(),
          name: town.name,
          residents: residentsRemoved,
        });
      } else {
        //Town Residents Added

        const residentsAdded = town.residents.filter((resident) => {
          return !oldTown.residents.includes(resident);
        });

        this.addDataToFile(path.resolve(logFiles.path, logFiles.memberJoin, town.name + ".json"), {
          date: Date.now(),
          name: town.name,
          residents: residentsAdded,
        });
      }

      if (oldTown.mayor != town.mayor) {
        //Town Mayor Changed
        this.addDataToFile(path.resolve(logFiles.path, logFiles.mayorChange, town.name + ".json"), {
          date: Date.now(),
          name: town.name,
          oldMayor: oldTown.mayor,
          newMayor: town.mayor,
        });
      }

      if (oldTown.assistants.length !== town.assistants.length) {
        //Town Assistants Changed

        if (oldTown.assistants.length > town.assistants.length) {
          //Town Assistants Removed

          const assistantsRemoved = oldTown.assistants.filter((assistant) => {
            return !town.assistants.includes(assistant);
          });

          this.addDataToFile(path.resolve(logFiles.path, logFiles.assistantRemove, town.name + ".json"), {
            date: Date.now(),
            name: town.name,
            assistants: assistantsRemoved,
          });
        } else {
          //Town Assistants Added

          const assistantsAdded = town.assistants.filter((assistant) => {
            return !oldTown.assistants.includes(assistant);
          });

          this.addDataToFile(path.resolve(logFiles.path, logFiles.assistantAdd, town.name + ".json"), {
            date: Date.now(),
            name: town.name,
            assistants: assistantsAdded,
          });
        }
      }
    }
  }

  private static updatePlayer(oldPlayers: Player[], player: Player) {
    const oldPlayer = oldPlayers.find((oldPlayer) => {
      return oldPlayer.name === player.name;
    });

    if (!oldPlayer) {
      //Player Joined
      this.addDataToFile(
        path.resolve(logFiles.path, logFiles.playerJoin, player.uuid + ".json"),

        {
          date: Date.now(),
          name: player.name,
          data: player,
        }
      );
      return;
    }

    const travelDistance = Util.getDistance({ x: oldPlayer.x, z: oldPlayer.z }, { x: player.x, z: player.z });

    if (travelDistance > teleportDistance) {
      //Player Teleported
      this.addDataToFile(path.resolve(logFiles.path, logFiles.PlayerTp, player.uuid + ".json"), {
        date: Date.now(),
        uuid: player.uuid,
        this: player.name,
        oldPos: { x: oldPlayer.x, z: oldPlayer.z },
        newPos: { x: player.x, z: player.z },
        distance: travelDistance,
      });
    }
  }

  private static checkForTownFalls(oldTowns: Town[], towns: Town[]) {
    oldTowns.forEach((oldTown) => {
      const town = towns.find((town) => {
        return oldTown.name === town.name;
      });

      if (!town) {
        //Town Fall
        this.addDataToFile(
          path.resolve(logFiles.path, logFiles.townFall, oldTown.name + ".json"),

          {
            date: Date.now(),
            name: oldTown.name,
            data: oldTown,
          }
        );
      }
    });
  }

  private static checkForPlayerLeave(oldPlayers: Player[], players: Player[]) {
    oldPlayers.forEach((oldPlayer) => {
      const player = players.find((player) => {
        return oldPlayer.name === player.name;
      });

      if (!player) {
        //Player Leave
        this.addDataToFile(
          path.resolve(logFiles.path, logFiles.playerLeave, oldPlayer.uuid + ".json"),

          {
            date: Date.now(),
            uuid: oldPlayer.uuid,
            data: oldPlayer,
          }
        );
      }
    });
  }

  public static updateTowns(towns: Town[]) {
    const oldTowns = this.getOldTowns();

    towns.forEach((town) => {
      this.updateTownData(oldTowns, town);
    });

    this.checkForTownFalls(oldTowns, towns);
  }

  public static updatePlayers(players: Player[]) {
    const oldPlayers = this.getOldPlayers();

    players.forEach((player) => {
      this.updatePlayer(oldPlayers, player);
    });

    this.checkForPlayerLeave(oldPlayers, players);

    players.forEach((player) => {
        if (this.getPlayerName(player.uuid) !== player.name) {
        this.saveUUID(player)
        }
    })
  }

  private static getOldTowns() {

    fs.existsSync(defaultFiles.filePath + defaultFiles.logs.logFilePath + "towns.old.json") || Logger.log("No old towns file found, waiting for it...");

    const oldTowns = JSON.parse(
      fs.readFileSync(defaultFiles.filePath + defaultFiles.logs.logFilePath + "towns.old.json", "utf8")
    );
    return oldTowns;
  }

  private static getOldPlayers() {

    fs.existsSync(defaultFiles.filePath + defaultFiles.logs.logFilePath + "players.old.json") || Logger.log("No old players file found, waiting for it...");

    const oldPlayers = JSON.parse(
      fs.readFileSync(defaultFiles.filePath + defaultFiles.logs.logFilePath + "players.old.json", "utf8")
    );
    return oldPlayers.players;
  }

  private static addDataToFile(file: string, data: any) {
    let fileData = [];
    if (fs.existsSync(path.resolve(logFiles.path, file))) {
      const rawData = fs.readFileSync(path.resolve(logFiles.path, file), "utf8");
      fileData = JSON.parse(rawData);
      fileData.push(data);
    } else {
      fileData = [data];
    }
    fs.writeFileSync(path.resolve(logFiles.path, file), JSON.stringify(fileData, null, 2));
  }

  private static saveUUID(player: Player) {
    if (!fs.existsSync(path.resolve(logFiles.path, "uuid.json"))) {
      fs.writeFileSync(path.resolve(logFiles.path, "uuid.json"), JSON.stringify([{name: player.name, uuid: player.uuid}], null, 2));
    } else {
        const data = JSON.parse(fs.readFileSync(path.resolve(logFiles.path, "uuid.json"), "utf8"));
        data.push({name: player.name, uuid: player.uuid});
        fs.writeFileSync(path.resolve(logFiles.path, "uuid.json"), JSON.stringify(data, null, 2));
    }
  }

    public static getUUID(name: string) {
        const data = JSON.parse(fs.readFileSync(path.resolve(logFiles.path, "uuid.json"), "utf8"));
        const player = data.find((player: Player) => {
            return player.name === name;
        });
        if (player == undefined) {
            return undefined;
        }
        return player.uuid;
    }

    public static getPlayerName(uuid: string) {
        const data = JSON.parse(fs.readFileSync(path.resolve(logFiles.path, "uuid.json"), "utf8"));
        const player = data.find((player: Player) => {
            return player.uuid === uuid;
        });
        if (player == undefined) {
            return undefined;
        }
        return player.name;
    }
}
