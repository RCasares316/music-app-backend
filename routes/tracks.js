import { Router } from "express";
import verifyToken from "../middleware/verify-token.js";
import * as controllers from "../controllers/tracks.js";

const router = Router();

router.get("/", verifyToken, controllers.getTracks);
router.get("/:trackId", verifyToken, controllers.getTrack);

export default router;
