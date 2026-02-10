import Playlist from "../models/playlist.js";

export const getUserPlaylists = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const getUserPlaylist = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const createPlaylist = async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const createdPlaylist = await Playlist.create(req.body);
    res.status(201).json(createdPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const deleted = await Playlist.findByIdAndDelete(playlistId);

    if (!deleted) {
      res.status(404);
      throw new Error("Playlist not found.");
    }

    res.status(200).json(deleted);
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ err: err.message });
    } else {
      res.status(500).json({ err: err.message });
    }
    console.log(error);
  }
};
