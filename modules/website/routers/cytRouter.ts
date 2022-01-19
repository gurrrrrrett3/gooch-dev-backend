import { Router } from 'express';
import path from 'path';
import cytInterface from '../../cyt/interface';

const router = Router();

router.get("/", (req, res) => {

    res.sendFile(path.resolve("../assets/html/cytApiIndex.html"));

})

router.get("/players", (req, res) => {
    res.send(cytInterface.getPlayerFile());
})

router.get("/player/:username", (req, res) => {
    res.send(cytInterface.getPlayer(req.params.username));
})

router.get("/player/nearby/:playername", (req, res) => {
    res.send(cytInterface.getSortedNearbyPlayers(req.params.playername));
})

router.get("/player/nearby/:playername/:radius", (req, res) => {

    res.send(cytInterface.getPlayersNearby(req.params.playername, parseInt(req.params.radius)));

})

router.get("/players/online", (req, res) => {
    res.send(cytInterface.getOnlineCounts());
})

router.get("/towns", (req, res) => {
    res.send(cytInterface.getTownFile());
})

router.get("/town/:townname", (req, res) => {
    res.send(cytInterface.getTown(req.params.townname));
})

router.get("/towns/online", (req, res) => {
    res.send(cytInterface.getOnlineTowns());
})

export default router;