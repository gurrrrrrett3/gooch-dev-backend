"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const interface_1 = __importDefault(require("../../cyt/interface"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.sendFile(path_1.default.resolve("../assets/html/cytApiIndex.html"));
});
router.get("/players", (req, res) => {
    res.send(interface_1.default.getPlayerFile());
});
router.get("/player/:username", (req, res) => {
    res.send(interface_1.default.getPlayer(req.params.username));
});
router.get("/online", (req, res) => {
    res.send(interface_1.default.getOnlineCounts());
});
router.get("/towns", (req, res) => {
    res.send(interface_1.default.getTownFile());
});
router.get("/town/:townname", (req, res) => {
    res.send(interface_1.default.getTown(req.params.townname));
});
router.get("/towns/online", (req, res) => {
    res.send(interface_1.default.getOnlineTowns());
});
exports.default = router;
