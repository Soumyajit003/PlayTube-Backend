import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

// controller to create tweet
const createTweet = asyncHandler(async (req, res) => {
  const { contentDetails } = req.body;

  if (!content) {
    throw new ApiError(400, "Content required!!!");
  }

  const tweet = await Tweet.create({
    owner: req.user?._id,
    title: contentDetails.title,
    content: contentDetails.content,
  });

  if (!tweet) {
    throw new ApiError(500, "Failed to create tweet!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully..."));
});

// controller to update existing tweet
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { updatedContent } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id!!!");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "No tweet found!!!");
  }

  if(tweet.owner?.toString() !== req.user?._id.toString()){
    throw new ApiError(400, "only owner can edit thier tweet!!!");
  }

  if (!updatedContent) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Nothing changed in tweet..."));
  }


  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
        $set:{
            title: updatedContent.title,
            content: updatedContent.content,
        },
    },
    { new: true}
  );

  if (!updatedTweet) {
    throw new ApiError(500, "Failed to update tweet!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully..."));
});

export default { createTweet, updateTweet };
