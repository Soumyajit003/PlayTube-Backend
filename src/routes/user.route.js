import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlerware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import multer from "multer";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);


// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router;