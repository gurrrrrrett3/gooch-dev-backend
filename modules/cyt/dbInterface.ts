import Util from "../util";
import { GetDataError, GetDataOptions, PlayerJoinReturn, TownFallReturn, TownRiseReturn } from "../util/types";
import dbManager from "./dbManager";
import TownLog from "./townLog";
export default class CYTDbInterface {
  /**
   *
   * @param lookback Time to look back, in hours
   * @returns
   */
  public static getFallenTowns(lookback: number) {
    return dbManager.getData({
      type: "TOWN",
      value: "townDelete",
      timeFrame: {
        before: Date.now(),
        after: Date.now() - lookback * 60 * 60 * 1000,
      },
    }) as TownFallReturn | GetDataError;
  }

  public static getRisenTowns(lookback: number) {
    return dbManager.getData({
      type: "TOWN",
      value: "townCreate",
      timeFrame: {
        before: Date.now(),
        after: Date.now() - lookback * 60 * 60 * 1000,
      },
    }) as TownRiseReturn | GetDataError;
  }

  public static getPlayerPlaytime(uuid: string) {
    let joinData = dbManager.getData({
      type: "PLAYER",
      dataType: "UUID",
      uuid: uuid,
      value: "playerJoin",
    }) as PlayerJoinReturn | GetDataError;

    let leaveData = dbManager.getData({
      type: "PLAYER",
      dataType: "UUID",
      uuid: uuid,
      value: "playerLeave",
    }) as PlayerJoinReturn | GetDataError;

    if (dbManager.isGetDataError(joinData)) {
      return joinData;
    }

    if (dbManager.isGetDataError(leaveData)) {
      return leaveData;
    }

    let sortedJoinData = joinData.sort((a, b) => a.date - b.date);
    let sortedLeaveData = leaveData.sort((a, b) => a.date - b.date);

    let joinTimes = sortedJoinData.map((data) => data.date);
    let leaveTimes = sortedLeaveData.map((data) => data.date);

    let playTime = 0;

    for (var i = 0; i < joinTimes.length; i++) {
      if (i < leaveTimes.length) {
        playTime += leaveTimes[i] - joinTimes[i];
      }
    }

    if (joinTimes.length > leaveTimes.length) {
      let lastJoin = joinTimes[joinTimes.length - 1];
      playTime += Date.now() - lastJoin;
    }

    return {
      uuid: uuid,
      name: TownLog.getPlayerName(uuid),
      playTime: playTime,
      playTimeString: Util.formatTime(playTime),
    };
  }

  public static query(data: GetDataOptions) {
    return dbManager.getData(data);
  }

  public static isValidQuery(data: GetDataOptions): data is GetDataOptions {
    let returnVal = true;
    let invalidReason = "";

    const valid = {
      townValues: [
        "assistantAdd",
        "assistantRemove",
        "mayorChange",
        "memberJoin",
        "memberLeave",
        "pvpToggle",
        "townCreate",
        "townDelete",
      ],
      playerValues: ["playerJoin", "playerLeave", "playerTeleport"],
    };

    if (data.type === "PLAYER") {
      if (data.dataType === "NAME") {
        if (!this.isUsernameValid(data.name)) {
          returnVal = false;
          invalidReason = "Invalid username";
        }
      }

      if (!valid.playerValues.includes(data.value)) {
        returnVal = false;
        invalidReason = "Invalid player value";
      }

      if (data.dataType === "UUID") {
        if (typeof data.uuid !== "string") {
            returnVal = false;
            invalidReason = "uuid must be a string";
        }  else if (data.uuid.length !== 36) {
            returnVal = false;
            invalidReason = "uuid must be a valid UUID";
        }
      }
    } else if (data.type === "TOWN") {
      if (data.name) {
        if (typeof data.name !== "string") {
            returnVal = false;
            invalidReason = "name must be a string";
        }
      }

      if (!valid.townValues.includes(data.value)) {
        returnVal = false;
        invalidReason = "Invalid value";
      }

    } else {
      returnVal = false;
      invalidReason = "Invalid type";
    }

    if (data.timeFrame) {
      if (data.timeFrame.before) {
        returnVal = returnVal && typeof data.timeFrame.before === "number" && data.timeFrame.before > 0;
      }

      if (data.timeFrame.after) {
        returnVal = returnVal && typeof data.timeFrame.after === "number" && data.timeFrame.after > 0;
      }

      if (data.timeFrame.before && data.timeFrame.after) {
        returnVal = returnVal && data.timeFrame.after > data.timeFrame.before;
      }

      if (!data.timeFrame.before && !data.timeFrame.after) {
        returnVal = false;
      }
    }

    console.log(returnVal, invalidReason);
    return returnVal;
  }

  public static isUsernameValid(username: string): boolean {
    return username.match(/[A-Za-z0-9_§]{3,16}/g) !== null;
  }
}
