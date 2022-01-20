import Util from "../util";
import { GetDataError, PlayerJoinReturn, TownFallReturn, TownRiseReturn } from "../util/types";
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
                after: Date.now() - (lookback * 60 * 60 * 1000)
            }
        }) as TownFallReturn | GetDataError;
    }
 
    
    public static getRisenTowns(lookback: number) {
        return dbManager.getData({
            type: "TOWN",
            value: "townCreate",
            timeFrame: {
                before: Date.now(),
                after: Date.now() - (lookback * 60 * 60 * 1000)
            }
        }) as TownRiseReturn | GetDataError;
    }

    public static getPlayerPlaytime(uuid: string) {

        let joinData = dbManager.getData({
            type: "PLAYER",
            uuid: uuid,
            value: "playerJoin",
        }) as PlayerJoinReturn | GetDataError;

        let leaveData = dbManager.getData({
            type: "PLAYER",
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

        let joinTimes = sortedJoinData.map(data => data.date);
        let leaveTimes = sortedLeaveData.map(data => data.date);

        let playTime = 0

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
            playTimeString: Util.formatTime(playTime)
        }
    }
}