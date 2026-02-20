import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "./../models/video.model.js";

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
    .json(new ApiResponse(200, "Video uploaded successfully:)"));
});

export { uploadVideo };
