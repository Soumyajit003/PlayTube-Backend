import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "./../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

// This is a general function to generate Access token and Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

// Registering new user
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
  const { fullname, email, username, password } = req.body;

  // validation for empty fields
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
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
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

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
    fullname,
    avatar: avatarUploaded.url,
    coverImage: coverImageUploaded?.url || "",
    password,
  });

  // removing password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created sucessfully."));
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  // Get user data from req.body
  // validate for empty field
  // checking the user using access token if logged in
  // checking wheather the user has refresh token or not
  // if dont has refresh token then check for username and password
  // if username exist then redirect to the register form
  // if user exist return success response
  // ---------------- another word -------------------
  // req.body -> data
  // username or email
  // find user
  // if found, check for password
  // if password match, generate access and refresh token
  // send cookie

  console.log(req.body);

  const { username, email, password } = req.body;

  // validating data to check empty field
  if (!username || !email) {
    throw new ApiError(400, "Username or Email required!!!");
  }

  // finding user if exist
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist!!!");
  }

  // checking for valid password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password!!!");
  }

  // generating access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refrestToken"
  ); //fetching the same user from the db

  // send in cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "User logged in successfully."
      )
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out sucessfully..."));

});


export { registerUser, loginUser, logoutUser };
