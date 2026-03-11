import { ApiResponse } from "../utils/ApiResponse";
import { Playlist } from "./../models/playlist.model";
import { Video } from "./../models/video.model";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";

// controller to create a playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(
      400,
      "Playlist name and description both are required!!!"
    );
  }

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user?._id,
  });

  if (!playlist) {
    throw new ApiError(500, "Failed to create playlist!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully..."));
});

// controller to update a playlist
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id!!!");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "No playlist found!!!");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    {
      name,
      description,
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(400, "Failed to update the playlist!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully...")
    );
});

export { createPlaylist, updatePlaylist };
