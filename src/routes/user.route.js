import {Router}from "express";
import {userRegister} from "../controllers/user.controllers.js";

const router=Router();
router.route("/register").post(userRegister);

export default router;
































/*


import { Router } from "express";
const router = Router();
import { Upload } from "../middlewares/multer.js";
import {registerUser, userLogin,userLogout} from "../controllers/user.controller.js";
router.route("/register").post(Upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT,userLogout);
export default {router};
*/