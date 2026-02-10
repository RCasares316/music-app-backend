import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
name: "",
img: "",
owner: {},
tracks: []
});
