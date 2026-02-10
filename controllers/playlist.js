import Playlist from "../models/playlist.js";

export const getUserPlaylists = async (req, res) => {
  try {
    const playlistData = await Playlist.find({}).populate("owner");
    res.json(playlistData);
  } catch (error) {
    console.lor(error);
  }
};

export const getUserPlaylist = async (req, res) => {
  try {
    const playlistData = await Playlist.findById(req.params.playlistId).populate("owner");
    res.json(playlistData);
  } catch (error) {
    console.log(error);
  }
};

export const createPlaylist = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const updatePlaylist = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const addTrack = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const removeTrack = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const deletePlaylist = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
