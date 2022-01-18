import { Router } from "express";
import cytRouter from "./cytRouter";

const router = Router();

router.use("/cyt", cytRouter)

export default router;