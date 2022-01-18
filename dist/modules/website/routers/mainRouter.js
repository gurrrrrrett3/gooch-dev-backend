"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiRouter_1 = __importDefault(require("./apiRouter"));
const router = (0, express_1.Router)();
router.use("/api", apiRouter_1.default);
exports.default = router;
