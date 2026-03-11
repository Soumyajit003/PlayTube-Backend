import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";

const router = Router();
router.use(verifyJWT);

router.route("/create").post(createPlaylist);
router.route("/update").patch(updatePlaylist);
router.route("/delete").delete(deletePlaylist);

router.route("/addvideo").post(addVideoToPlaylist);
router.route("/removevideo").post(removeVideoFromPlaylist);

router.route("/getplaylist").get(getPlaylistById);
router.route("/getuserplaylist").get(getUserPlaylists);

export default router;
