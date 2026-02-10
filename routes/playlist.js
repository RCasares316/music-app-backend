import { Router } from "express";

const router = Router();

// routes ex. router.get("/", controllers.getPlaylists)

router.get("/", controllers.gteUserPlaylist);
router.get("/:playlistId", controllers.gteUserPlaylist);
router.post("/", controllers.createPlaylist);
router.put("/:playlistId", controllers.updatePlaylist);
router.put("/:playlistId/track/:trackId", controllers.addTrack);
router.put("/:playlistId/track/:trackId", controllers.removeTrack);
router.delete("/:playlistId", controllers.deletePLaylist);

export default router;
