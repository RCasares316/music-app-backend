import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  artwork: String,
  genre: String,
  description: String,
  duration: Number,
  streamUrl: { type: String, unique: true },
  permalink: String,
});

export default mongoose.model("Track", trackSchema);
