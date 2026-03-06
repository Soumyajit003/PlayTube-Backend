import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserChannelSubscriber, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/channel/:channelId")
        .post(toggleSubscription)
        .get(getUserChannelSubscriber)

export default router;