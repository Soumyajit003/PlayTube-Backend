import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getVideoFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "./../models/video.model.js";

// controller for uploading video
const uploadVideo = asyncHandler(async (req, res) => {
  //TODO:
  // Getting the video data from the body
  // validate the data
  // upload the file to the cloudinary using multer

  const { title, description } = req.body;  

  if (
    [title, description,].some(
      (field) => field?.trim() == ""
    )
  ) {
    throw new ApiError(400, "All fields are required to upload the video!!!");
  }

  const videoLocalPath = req.files.videofile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  if(!videoLocalPath || !thumbnailLocalPath){
    throw new ApiError(400, "Video file and thumbnail are required!!!");
  }

  const videoUploaded = await uploadOnCloudinary(videoLocalPath);
  const thumbnailUploaded = await uploadOnCloudinary(thumbnailLocalPath);

  const owner = await User.findById(req.user?._id);

  if (!videoUploaded) {
    throw new ApiError(400, "Video file is required!!!");
  }
  if (!thumbnailUploaded) {
    throw new ApiError(400, "Thumbnail is required!!!");
  }

  const video = await Video.create({
    title,
    description,
    videofile: videoUploaded.url,
    videoPublicId: videoUploaded.public_id,
    thumbnail: thumbnailUploaded.url,
    thumbnailPublicId: thumbnailUploaded.public_id,
    owner
  });

  return res
    .status(200)
    .json(new ApiResponse(200,video.title, "Video uploaded successfully:)"));
});

// controller to get all videos
const getAllVideos = asyncHandler(async (req, res) => {
  const { page=1, limit=10, sortBy='createdAt', sortType='desc', query, userId, } = req.query;
  const pipeline = [];

  // first have to create search index in mongodb atlas
  // then we have to map fields, like - title, description
  // so the search text index will find from the fields 
  // our search index is "search-videos"

  if(query){
    pipeline.push({
      $search:{
        index: "search-videos",
        text:{
          query: query,
          path: ["title", "description"]
        }
      }
    })
  }
  
  // if search using any userid
  if(userId){
    if(!isValidObjectId(userId)){
      throw new ApiError(400, "Invalid userId!!!");
    }else{
      pipeline.push({
        $match:{
          owner: new mongoose.Types.ObjectId(userId)
        }
      })
    }
  }

  // fetch only those videos which are published
  pipeline.push({
    $match: {
      isPublished:true
    }
  })

  // sortBy - views, createdAt, duration
  // sortType - ascending, descending
  if(sortBy && sortType){
    pipeline.push({
      $sort:{
        [sortBy]:sortType == "asc" ? 1 : -1
      }
    })
  }else{
    pipeline.push({
      $sort:{
      createdAt:-1
      }
    })
  }

  // lookup with user
  pipeline.push(
    {
      $lookup:{
        from:"users",
        localField: "owner",
        foreignField: "_id",
        as:"ownerDetails",
        pipeline:[{
          $project:{
            username:1,
            "avatar.url":1
          }
        }]
      }
    },
    {
      $unwind:"$ownerDetails"
    }
  )

  const videoAggregate = Video.aggregate(pipeline);

  // now its time to do pagination for fast response
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }

  const video = await Video.aggregatePaginate(videoAggregate, options);

  return res
  .status(200)
  .json(new ApiResponse(200, video, "Videos fetched successfully"));

})

// controller to get video by Id
const getVideoById = asyncHandler( async (req, res) => {
    const { videoId } = req.params;

    if(!videoId){
        throw new ApiError(400, "Videos id is missing!!!");
    }

    const video = await Video.findById(videoId);
    const cloudinaryVideo = getVideoFromCloudinary(video.videoPublicId);

    return res
    .status(200)
    .json(new ApiResponse(200, cloudinaryVideo, "Video fetched by Id successfully..."));

})

export { uploadVideo, getAllVideos, getVideoById };
