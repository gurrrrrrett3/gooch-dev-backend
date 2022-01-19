import fs from "fs";
import path from "path";
import { Player, Town } from "../util/types";
import fileList from "./data/filelist.json";
import defaultFiles from "./data/defaultFiles.json";
import Util from "../util";

export default class CYTInterface {
  public static getPlayerFile() {
    return JSON.parse(
      fs
        .readFileSync(
          path.resolve(
            fileList.filePath,
            fileList.files.players.fileLocation,
            fileList.files.players.fileName
          ),
          "utf8"
        )
        .toString()
    ).players;
  }

  public static getTownFile() {
    return JSON.parse(
      fs
        .readFileSync(
          path.resolve(
            defaultFiles.filePath,
            defaultFiles.files.created.towns.location,
            defaultFiles.files.created.towns.name
          ),
          "utf8"
        )
        .toString()
    );
  }

  public static getPlayer(playerName: string): Player | string {
    const playerdata = this.getPlayerFile().find((player: Player) => {
      return player.name.toLowerCase() === playerName.toLowerCase();
    });

    if (!playerdata) {
      return "Player not found";
    }

    return playerdata;
  }

  public static getOnlineCounts() {
    let playerData = this.getPlayerFile();

    let outData: { total: number; afk: number; worlds: { name: string; count: number }[] } = {
      total: playerData.length,
      afk: 0,
      worlds: [],
    };

    this.getPlayerFile().forEach((player: Player) => {
      if (player.x == 25 && player.z == 42) {
        outData.afk++;
      }

      if (
        !outData.worlds.find((world: { name: string; count: number }) => {
          return world.name == player.world;
        })
      ) {
        outData.worlds.push({ name: player.world, count: 1 });
      } else {
        //@ts-ignore
        outData.worlds.find((world: { name: string; count: number }) => {
          return world.name == player.world;
        }).count++;
      }
    });

    return outData;
  }

  public static getTown(name: string): Town {
    const towns = this.getTownFile();
    const town = towns.find((town: any) => {
      return town.name.toLowerCase() === name.toLowerCase();
    });

    return town;
  }

  public static getPlayerTown(playerName: string): Town | string {
    const player = this.getPlayer(playerName);

    if (player === "Player not found") {
      return "Player not found";
    } else {
      const towns = this.getTownFile();

      const town = towns.find((town: Town) => {
        //@ts-ignore
        return town.residents.includes(player.name);
      });

      return town;
    }
  }

  public static getOnlineTowns() {
    let players = this.getPlayerFile();

    let onlineTowns: { town: string; online: number }[] = [{ town: "Townless", online: 0 }];

    players.forEach((player: Player) => {
      const town = this.getPlayerTown(player.name);

      if (!town) {
        onlineTowns[0].online++;
      } else {
        //@ts-ignore
        const data = { town: town.name, online: 1 };

        if (
          !onlineTowns.find((town: { town: string; online: number }) => {
            return town.town === data.town;
          })
        ) {
          onlineTowns.push(data);
        } else {
          //@ts-ignore
          onlineTowns.find((town: { town: string; online: number }) => {
            return town.town === data.town;
          }).online++;
        }
      }
    });

    return onlineTowns;
  }

  public static getPlayersNearby(playerName: string, radius: number): { player: string; distance: number }[] {
    return this.getSortedNearbyPlayers(playerName).filter((player: { player: string; distance: number }) => {
      return player.distance <= radius;
    })
  }

  public static getSortedNearbyPlayers(playerName: string): { player: string; distance: number }[] {
    const player = this.getPlayer(playerName);

    if (player === "Player not found") {
      return [];
    } else {
      const players = this.getPlayerFile();

      const nearbyPlayers: { player: string; distance: number }[] = [];

      players.forEach((player2: Player) => {
        if (typeof player == "string")  return
        if (player.name !== player2.name && player.world === player2.world) {
          nearbyPlayers.push({ player: player2.name, distance: Util.getDistance({ x: player.x, z: player.z }, { x: player2.x, z: player2.z }) });
        }
      });

      return nearbyPlayers.sort((a, b) => a.distance - b.distance);
    }
  }


}
