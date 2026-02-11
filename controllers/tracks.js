import axios from "axios";
import Track from "../models/track.js";
import { getAccessToken } from "../utils/soundCloudAuth.js";

export const getTracks = async (req, res) => {
  try {
    const allTracks = await Track.find({});
    res.json(allTracks);
  } catch (error) {
    console.log(error);
  }
};

export const getTrack = async (req, res) => {
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
};
