import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "./../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend
  // Validations - no empty fields
  // User do not exists : username, email
  // Check for images, and avatar
  // Then upload them into cloudinary
  // create user object - create entry in db
  // remove password and refresh token from response
  // Check for user creation
  // return response


  // Getting user details from frontend
  const { fullName, email, username, password } = req.body;

  console.log(fullName, email, username);

  // validation for empty fields
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!!!");
  }

  // checking for existing users
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "username and email already exists!!!");
  }

  // checking for avatar image
  const avatarLocalPath = req.files?.avatar[0]?.path;

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!!!");
  }

  const avatarUploaded = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUploaded = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatarUploaded) {
    throw new ApiError(400, "Avatar is required!!!");
  }

  // creating user object for db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    avatar: avatarUploaded.url,
    coverImage: coverImageUploaded?.url || "",
  });

  // removing password and refresh token from response
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User created sucessfully.")
  )

});

export { registerUser };
