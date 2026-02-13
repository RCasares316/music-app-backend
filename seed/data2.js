import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Track from "../models/track.js";

dotenv.config();

const { MONGODB_URI, SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET } =
  process.env;

// ---------------------------------------------
// Your chosen SoundCloud URLs (tracks + playlists)
// ---------------------------------------------
const TRACK_URLS = [
  "https://soundcloud.com/rico_nasty/smack-a-bitch-bonus",
  "https://soundcloud.com/tobenwigwe/try-jesus",
  "https://soundcloud.com/charitythe-artist/warm-and-soft-7",
  "https://soundcloud.com/eclectic-nightcore/nightcore-morning-in-america",
  "https://soundcloud.com/tobenwigwe/sets/hood-hymns-2",
  "https://soundcloud.com/jonbellion/kingdom-come",
  "https://soundcloud.com/szababy2/sets/ctrl-6",
  "https://soundcloud.com/liluzivert/sets/luv-is-rage-2-4",
  "https://soundcloud.com/liluzivert/sets/lil-uzi-vert-vs-the-world-2",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/sets/artist-167",
  "https://soundcloud.com/mtr-877663911/nails-slomo",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/i-know-whats-real-1",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/still-think-about-you",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/a-boogie-my-shit-prod-by-d-stackz",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/d-t-b-interlude",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/friend-zone",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/jungle",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/1hunnit",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/money-over-everything",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/trap-house",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/fall-in-love",
  "https://soundcloud.com/a-boogie-wit-da-hoodie/artist-1",
  "https://soundcloud.com/blonded/nights",
  "https://soundcloud.com/blonded/ivy",
  "https://soundcloud.com/blonded/pink-white",
  "https://soundcloud.com/blonded/self-control",
  "https://soundcloud.com/j-cole/06-j-cole-3-wishes-prod-by",
  "https://soundcloud.com/j-cole/4-your-eyez-only-1",
  "https://soundcloud.com/j-cole/neighbors-1",
  "https://soundcloud.com/j-cole/deja-vu-1",
  "https://soundcloud.com/goodgroovesongs/corinne-bailey-rae-put-your",
  "https://soundcloud.com/laufeylin/from-the-start",
  "https://soundcloud.com/laufeylin/falling-behind",
  "https://soundcloud.com/ravynlenaesounds/love-me-not",
  "https://soundcloud.com/szababy2/love-galore-alt-version",
  "https://soundcloud.com/szababy2/garden-say-it-like-dat",
  "https://soundcloud.com/oliviaadean/man-i-need",
  "https://soundcloud.com/jonbellion/kingdom-come",
  "https://soundcloud.com/jonbellion/conversations-with-my-wife",
  "https://soundcloud.com/jonbellion/conversations-with-my-wife",
  "https://soundcloud.com/itsellamai/bood-up-1",
  "https://soundcloud.com/tobenwigwe/im-not-god-feat-andra-day",
  "https://soundcloud.com/hailee-steinfeld-official/starving-acoustic",
  "https://soundcloud.com/bleep-149366857/1-hour-loop-mirrors-justin",
  "https://soundcloud.com/dres_island/justin-timberlake-suit-tie-ft",
  "https://soundcloud.com/danielcaesar/get-you-kali-uchis",
  "https://soundcloud.com/jeremy-mcclain-383700971/best-part-1",
  "https://soundcloud.com/brunomars/just-the-way-you-are-2",
  "https://soundcloud.com/funofficial/some-nights",
  "https://soundcloud.com/funofficial/fun-we-are-young-feat-janelle",
  "https://soundcloud.com/will-rausch/andre-3000-hey-ya",
  "https://soundcloud.com/blackpinkofficial/how-you-like-that",
  "https://soundcloud.com/stray_kids/chk-chk-boom",
  "https://soundcloud.com/taylorswiftofficial/love-story-taylors-version",
];

// ------------------ helpers ------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------ STEP 1: get access token ------------------
async function getAccessToken() {
  const res = await axios.post(
    "https://secure.soundcloud.com/oauth/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
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

// ------------------ STEP 2: resolve URL -> resource ------------------
async function resolveUrl(token, url) {
  const res = await axios.get("https://api.soundcloud.com/resolve", {
    headers: { Authorization: `OAuth ${token}` },
    params: { url },
  });

  return res.data; // track | playlist | user | ...
}

// ------------------ STEP 3: fetch full track by id ------------------
async function fetchTrackById(token, id) {
  const res = await axios.get(`https://api.soundcloud.com/tracks/${id}`, {
    headers: { Authorization: `OAuth ${token}` },
  });

  return res.data;
}

// ------------------ map SoundCloud track -> YOUR schema ------------------
function mapToSchema(t) {
  return {
    title: t.title ?? "",
    artist: t.user?.username ?? "",
    artwork: t.artwork_url ?? "",
    genre: t.genre ?? "",
    description: t.description ?? "",
    duration: Number(t.duration ?? 0),
    streamUrl: t.stream_url ?? "", // unique field in your schema
    permalink: t.permalink_url ?? "",
  };
}

// ------------------ upsert helper ------------------
async function upsertTrack(mapped) {
  // streamUrl is unique in your schema; if it's missing, skip to avoid bad inserts
  if (!mapped.streamUrl) return { status: "skipped_no_streamUrl" };

  await Track.findOneAndUpdate({ streamUrl: mapped.streamUrl }, mapped, {
    upsert: true,
    new: true,
  });

  return { status: "saved" };
}

// ------------------ STEP 4: seed ------------------
async function seed() {
  try {
    console.log("Connecting to Mongo...");
    await mongoose.connect(MONGODB_URI);
    console.log("Mongo connected");

    await mongoose.connection.dropDatabase();
    console.log("Database dropped");

    console.log("Getting SoundCloud token...");
    const token = await getAccessToken();

    let savedCount = 0;
    let skippedCount = 0;

    for (const url of TRACK_URLS) {
      console.log(`\nResolving: ${url}`);

      let resource;
      try {
        resource = await resolveUrl(token, url);
      } catch (err) {
        const status = err.response?.status;
        const data = err.response?.data;
        console.log(`⚠️ Resolve failed (status ${status ?? "?"}) for ${url}`);
        if (data) console.log("   ↳", data);
        continue;
      }

      if (!resource?.kind) {
        console.log("⚠️ Skipping: unknown resource");
        continue;
      }

      // ------------------ single track ------------------
      if (resource.kind === "track") {
        const mapped = mapToSchema(resource);
        const result = await upsertTrack(mapped);

        if (result.status === "saved") {
          savedCount++;
          console.log(`✅ Saved track: ${mapped.title}`);
        } else {
          skippedCount++;
          console.log(`⚠️ Skipped track (no streamUrl): ${mapped.title}`);
        }

        await sleep(200);
        continue;
      }

      // ------------------ playlist: expand tracks ------------------
      if (resource.kind === "playlist") {
        const playlistName = resource.title || "(untitled playlist)";
        const tracks = Array.isArray(resource.tracks) ? resource.tracks : [];

        console.log(`📚 Playlist: ${playlistName} (${tracks.length} tracks)`);

        for (const t of tracks) {
          // playlists often contain partial track objects -> fetch full track by id
          if (!t?.id) {
            skippedCount++;
            console.log("⚠️ Skipped playlist track (missing id)");
            continue;
          }

          const full = await fetchTrackById(token, t.id);
          const mapped = mapToSchema(full);
          const result = await upsertTrack(mapped);

          if (result.status === "saved") {
            savedCount++;
            console.log(`✅ Saved: ${mapped.title}`);
          } else {
            skippedCount++;
            console.log(`⚠️ Skipped (no streamUrl): ${mapped.title}`);
          }

          await sleep(200);
        }

        continue;
      }

      // ------------------ other kinds (user, etc.) ------------------
      console.log(`⚠️ Skipping unsupported kind: ${resource.kind}`);
    }

    console.log(
      `\n✅ Seed complete! Saved=${savedCount}, Skipped=${skippedCount}`,
    );
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seed();
