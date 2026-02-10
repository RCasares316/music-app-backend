import { Router } from "express";
import verifyToken from "../middleware/verify-token.js";
import * as controllers from "../controllers/playlist.js";

const router = Router();

router.get("/", verifyToken, controllers.getUserPlaylist);
router.get("/:playlistId", verifyToken, controllers.getUserPlaylist);
router.post("/", verifyToken, controllers.createPlaylist);
router.put("/:playlistId", verifyToken, controllers.updatePlaylist);
router.put("/:playlistId/track/:trackId", verifyToken, controllers.addTrack);
router.put("/:playlistId/track/:trackId", verifyToken, controllers.removeTrack);
router.delete("/:playlistId", verifyToken, controllers.deletePlaylist);

export default router;
