import {Router}from "express";
import {userRegister} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewre.js";

const router=Router();
router.route("/register").post(upload.fields([{name:"profile",maxCount:1}]),userRegister);

export default router;






























