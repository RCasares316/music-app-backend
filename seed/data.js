import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Track from "../models/track.js";

dotenv.config();

const { MONGODB_URI, SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET } =
  process.env;

// ------------------ helpers ------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function randomLetter() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return chars[Math.floor(Math.random() * chars.length)];
}

function randomOffset() {
  return Math.floor(Math.random() * 2000);
}

// ------------------ STEP 1: get access token ------------------

async function getAccessToken() {
  const res = await axios.post(
    "https://secure.soundcloud.com/oauth/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${SOUNDCLOUD_CLIENT_ID}:${SOUNDCLOUD_CLIENT_SECRET}`,
          ).toString("base64"),
      },
    },
  );

  return res.data.access_token;
}

// ------------------ STEP 2: fetch tracks ------------------

async function fetchTracks(token) {
  const res = await axios.get("https://api.soundcloud.com/tracks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: randomLetter(),
      limit: 50,
      offset: randomOffset(),
      access: "playable",
    },
  });

  return res.data
    .filter((t) => t.streamable)
    .map((t) => ({
      title: t.title,
      artist: t.user?.username,
      artwork: t.artwork_url,
      genre: t.genre,
      tags: t.tag_list,
      description: t.description,
      duration: t.duration,
      streamUrl: t.stream_url,
      permalink: t.permalink_url,
    }));
}

// ------------------ STEP 3: seed ------------------

async function seed() {
  try {
    console.log("Connecting to Mongo...");
    await mongoose.connect(MONGODB_URI);
    console.log("Mongo connected");

    console.log("Getting SoundCloud token...");
    const token = await getAccessToken();

    const unique = new Map();

    while (unique.size < 100) {
      const batch = await fetchTracks(token);

      for (const track of batch) {
        if (!unique.has(track.streamUrl)) {
          unique.set(track.streamUrl, track);
        }
        if (unique.size >= 100) break;
      }

      console.log(`Collected ${unique.size}/100 tracks`);
      await sleep(400);
    }

    const tracks = Array.from(unique.values());

    await Track.insertMany(tracks, { ordered: false });

    console.log("✅ Seed complete!");
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seed();
