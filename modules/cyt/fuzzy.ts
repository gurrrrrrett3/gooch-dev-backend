import { Player } from "../util/types";
import CYTInterface from "./interface";

const fuzzyset = require("fuzzyset");

export default class Fuzzy {

    public onlinePlayerFuzzyset: any;
    public offlinePlayerFuzzyset: any;
    public townFuzzyset: any;

    public constructor() {
        this.onlinePlayerFuzzyset = fuzzyset();
        this.offlinePlayerFuzzyset = fuzzyset();
        this.townFuzzyset = fuzzyset();
    }

    public init() {

        //get online players
        CYTInterface.getPlayerFile().forEach((player: Player) => {
            this.onlinePlayerFuzzyset.add(player.name, player);
        })

    }

}