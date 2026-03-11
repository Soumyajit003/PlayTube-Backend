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
