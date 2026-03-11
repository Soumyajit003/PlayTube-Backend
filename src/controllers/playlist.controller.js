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

  if (playlist.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can not update this playlist, as you are not the owner!!!"
    );
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
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

// controller to delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id!!!");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "No playlist found!!!");
  }

  if (playlist.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can not delete this playlist, as you are not the owner!!!"
    );
  }

  await Playlist.findByIdAndDelete(playlist?._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully..."));
});

// controller to add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id!!!");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id!!!");
  }

  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if (!playlist) {
    throw new ApiError(400, "No playlist found!!!");
  }
  if (!video) {
    throw new ApiError(400, "No vidoe found!!!");
  }

  if (playlist.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not the owner of this playlist");
  }

  if (playlist.owner.toString() !== video.owner.toString()) {
    throw new ApiError(
      403,
      "You can only add your own videos to this playlist"
    );
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlist?._id,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(400, "Failed to add video to playlist!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Added video to playlist successfully..."
      )
    );
});

export { createPlaylist, updatePlaylist, deletePlaylist, addVideoToPlaylist };
