import {Router}from "express";
import {userRegister} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewre.js";
import {userLogin,userLogout,changePassword} from "../controllers/user.controllers.js";
const router=Router();
router.route("/register").post(upload.fields([{name:"profile",maxCount:1}]),userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
router.route("/updateusername").patch(updateProfile);

router.route("/updatepasssword").put(changePassword);


export default router;






























