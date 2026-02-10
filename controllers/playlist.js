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

export const createPlaylist = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.playlistId,
      req.body,
    );

    if (!updatedPlaylist) {
      res.status(404);
      throw new Error("Pet not found.");
    }

    res.json(updatedPlaylist);
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ err: err.message });
    } else {
      res.status(500).json({ err: err.message });
    }
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
