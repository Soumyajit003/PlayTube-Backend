import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

// controller to create tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if(!content){
        throw new ApiError(400, "Content required!!!");
    }
    
    const tweet = await Tweet.create({
        owner: req.user?._id,
        content:content
    });
    
    if(!tweet){
        throw new ApiError(500, "Failed to create tweet!!!");
    }

    return res
    .status(200)
    .json( new ApiResponse(200, tweet, "Tweet created successfully..."));

})

export default { createTweet };