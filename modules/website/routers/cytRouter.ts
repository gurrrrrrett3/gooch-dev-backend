import { Router } from "express";
import path from "path";
import CYTDbInterface from "../../cyt/dbInterface";
import cytInterface from "../../cyt/interface";
import TownLog from "../../cyt/townLog";

const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve("../assets/html/cytApiIndex.html"));
});

router.get("/players", (req, res) => {
  res.send(cytInterface.getPlayerFile());
});

router.get("/player/:username", (req, res) => {
  res.send(cytInterface.getPlayer(req.params.username));
});

router.get("/player/offline/:username", (req, res) => {});

router.get("/player/nearby/:playername", (req, res) => {
  res.send(cytInterface.getSortedNearbyPlayers(req.params.playername));
});

router.get("/player/nearby/:playername/:radius", (req, res) => {
  res.send(cytInterface.getPlayersNearby(req.params.playername, parseInt(req.params.radius)));
});

router.get("/player/:name/playtime", (req, res) => {
const name = req.params.name;

  if (name) {
      const uuid = TownLog.getUUID(name);
        if (uuid) {
    res.send(CYTDbInterface.getPlayerPlaytime(uuid));
        } else {
            res.send({
                error: "NO_DATA",
                message: "Player not in database",
            });
        }
  } else {
    res.send(
      JSON.stringify({
        error: "MISSING_PARAMETER",
        message: "Missing parameter: name",
      })
    );
  }
});

router.get("/players/online", (req, res) => {
  res.send(cytInterface.getOnlineCounts());
});

router.get("/towns", (req, res) => {
  res.send(cytInterface.getTownFile());
});

router.get("/town/:townname", (req, res) => {
  res.send(cytInterface.getTown(req.params.townname));
});

router.get("/towns/online", (req, res) => {
  res.send(cytInterface.getOnlineTowns());
});

router.get("/towns/fallen", (req, res) => {
  res.send(CYTDbInterface.getFallenTowns(24));
});

router.get("/towns/fallen/:hours", (req, res) => {
  res.send(CYTDbInterface.getFallenTowns(parseInt(req.params.hours)));
});

router.post("/query", (req, res) => {
    
  const body = req.body;

  console.log(body);

  if (!CYTDbInterface.isValidQuery(body)) {
    res.send({
      error: "INVALID_QUERY",
      message: "Invalid query",
    });
  } else {
    res.send(CYTDbInterface.query(body));
  }

})

export default router;
