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
router.route("/update/:playlistId").patch(updatePlaylist);
router.route("/delete/:playlistId").delete(deletePlaylist);

router.route("/addvideo/:playlistId/:videoId").post(addVideoToPlaylist);
router.route("/removevideo/:playlistId/:videoId").post(removeVideoFromPlaylist);

router.route("/getplaylist").get(getPlaylistById);
router.route("/getuserplaylist").get(getUserPlaylists);

export default router;
