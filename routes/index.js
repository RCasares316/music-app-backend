import { Router } from "express";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import tracksRouter from "./tracks.js";
import playlistRouter from "./playlist.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/tracks", tracksRouter);
router.use("/playlist", playlistRouter);

export default router;
