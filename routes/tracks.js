import { Router } from "express";
import axios from "axios";
import { getAccessToken } from "../utils/soundCloudAuth.js";

const router = Router();

// This receives the track id from your DB
router.get("/:trackId", async (req, res) => {
  try {
    const token = await getAccessToken();

    const soundcloudUrl = `https://api.soundcloud.com/tracks/${req.params.trackId}/preview`;

    const scRes = await axios.get(soundcloudUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "stream",
    });

    // Important headers so browser knows this is audio
    res.setHeader("Content-Type", "audio/mpeg");

    scRes.data.pipe(res);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error streaming audio");
  }
});

export default router;
