import mongoose, { Schema } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// controller to comment on videos
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content) {
    throw new ApiError(400, "Content required!!!");
  }

  const video = await Video.find(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found!!!");
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: req.user?._id,
  });
  if (!comment) {
    throw new ApiError(500, "Failed to add comment please try again");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// controller to update comment
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content) {
    throw new ApiError(400, "Content required!!!");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "No comment found!!!");
  }

  if(comment?.owner.toString() !== req.user?._id.toString()){
    throw new ApiError(400, "Only comment owner can edit their comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    comment?._id,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(500, "Failed to edit comment please try again");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedComment, "Comment updated successfully...")
    );
});

// controller to delete comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
})

export { addComment, updateComment };
