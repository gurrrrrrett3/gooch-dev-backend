import fs from "fs";
import path from "path";
import {
  AssistantAddReturn,
  AssistantRemoveReturn,
  FileTypes,
  GetDataError,
  GetDataOptions,
  GetDataPlayerValues,
  GetDataTownValues,
  GetPlayerDataOptions,
  GetPlayerDataOptionsByName,
  GetTownDataOptions,
  LoadFileError,
  MayorChangeReturn,
  PlayerJoinReturn,
  PlayerLeaveReturn,
  PlayerTeleportReturn,
  PvpToggleReturn,
  ResidentJoinReturn,
  ResidentLeaveReturn,
  TimeFrameOptions,
  Town,
  TownFallReturn,
  TownRiseReturn,
} from "../util/types";
import TownLog from "./townLog";
import defaultFiles from "./data/defaultFiles.json";
import Logger from "../util/logger";

export default class dbManager {
  public static getData(options: GetDataOptions) {
    if (!options.timeFrame) {
      options.timeFrame = {};
    }

    if (options.type === "TOWN") {
      return this.getTownData(options);
    } else if (options.type === "PLAYER") {
      return this.getPlayerData(options);
    }
  }

  private static getTownData(options: GetTownDataOptions) {
    if (options.value == "townCreate" || options.value == "townDelete") {
      const data = this.loadTownChangeData(
        options.value == "townCreate" ? "CREATE" : "DELETE",
        options.timeFrame
      );

      if (data.length === 0) {
        return {
          error: "NO_DATA",
          message: "No data found, try expanding the time frame.",
          request: options,
        } as GetDataError;
      } else {
      }
    } else {
      if (options.name === undefined) {
        return {
          error: "NO_NAME",
          message: "You need to provide a name for this search option.",
          request: options,
        } as GetDataError;
      }

      return this.getFile(options, options.name);
    }
  }

  private static getPlayerData(options: GetPlayerDataOptions) {
    const playerUUid = this.isByName(options) ? TownLog.getUUID(options.name) : options.uuid;

    if (playerUUid === undefined) {
      return {
        error: "PLAYER_NOT_FOUND",
        message:
          "Could not find player, they may not have joined the server yet, or you may have typed the name incorrectly.",
        request: options,
      } as GetDataError;
    }

    return this.getFile(options, playerUUid);
  }

  private static getFile(dataType: GetTownDataOptions | GetPlayerDataOptions, name: string) {
    try {
      const filePath = path.resolve(
        defaultFiles.filePath,
        defaultFiles.logs.logFilePath,
        dataType.value + "/" + name + ".json"
      );
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      return this.assignDataType(dataType.value, jsonData);
    } catch (error) {
      return {
        error: "FILE_NOT_FOUND",
        message: "Could not find file, please try again later.",
        request: dataType,
      } as LoadFileError;
    }
  }

  private static loadTownChangeData(option: "CREATE" | "DELETE", timeFrame: TimeFrameOptions | undefined) {
    const fileList = this.generateListOfFiles(option, timeFrame);

    const outList = [];

    for (const file of fileList) {
      const data: Town[] = JSON.parse(
        fs.readFileSync(path.resolve(defaultFiles.filePath, defaultFiles.logs.logFilePath, file), "utf8")
      );
      for (const town of data) {
        outList.push(town);
      }
    }

    return outList;
  }

  private static generateListOfFiles(dataType: "CREATE" | "DELETE", timeFrame: TimeFrameOptions | undefined) {
    const outList = [];
    const files = fs.readdirSync(
      path.resolve(
        defaultFiles.filePath,
        defaultFiles.logs.logFilePath + (dataType == "CREATE" ? "townFall" : "townRise") + "/"
      )
    );

    timeFrame || (timeFrame = {});

    const start = timeFrame.before ? timeFrame.before : 0;
    const end = timeFrame.after ? timeFrame.after : Date.now();

    for (const file of files) {
      const fileDate = this.fileNameToDate(file);
      if (fileDate >= start && fileDate <= end) {
        outList.push(file);
      }
    }

    return outList;
  }

  private static fileNameToDate(fileName: string) {
    const list = fileName.split("-");
    return new Date(parseInt(list[0]), parseInt(list[1]) - 1, parseInt(list[2])).getTime();
  }

  private static assignDataType(options: GetDataTownValues | GetDataPlayerValues, data: FileTypes) {
    switch (options) {
      case "assistantAdd":
        return data as AssistantAddReturn;
      case "assistantRemove":
        return data as AssistantRemoveReturn;
      case "mayorChange":
        return data as MayorChangeReturn;
      case "memberJoin":
        return data as ResidentJoinReturn;
      case "memberLeave":
        return data as ResidentLeaveReturn;
      case "pvpToggle":
        return data as PvpToggleReturn;
      case "townCreate":
        return data as TownRiseReturn;
      case "townDelete":
        return data as TownFallReturn;
      case "playerJoin":
        return data as PlayerJoinReturn;
      case "playerLeave":
        return data as PlayerLeaveReturn;
      case "playerTeleport":
        return data as PlayerTeleportReturn;

      default:
        return {
          error: "INVALID_OPTION",
          message: "The option you have selected is invalid.",
          request: options,
        } as LoadFileError;
    }
  }

  /**
   * Checks if the player search is to be done by name or by UUID
   * @param options
   * @returns true if the data is by name, false if by uuid
   */
  private static isByName(options: GetPlayerDataOptions): options is GetPlayerDataOptionsByName {
    return (options as GetPlayerDataOptionsByName).name !== undefined;
  }

  /**
   * Checks if the returned object is an error
   * @param data
   * @returns true if the data is an error, false if not
   */
  public static isLoadFileError(data: any): data is LoadFileError {
    return (data as LoadFileError).error !== undefined;
  }

  /**
   * Checks if the returned object is an error
   * @param data
   * @returns true if the data is an error, false if not
   */
  public static isGetDataError(data: any): data is GetDataError {
    return (data as GetDataError).error !== undefined;
  }
}
