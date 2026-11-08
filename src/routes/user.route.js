import {Router}from "express";
import {userRegister} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewre.js";
import {userLogin,userLogout,updateuserName,updatePassword,updatePhoneNumber} from "../controllers/user.controllers.js";
const router=Router();
router.route("/register").post(upload.fields([{name:"profile",maxCount:1}]),userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
router.route("/updateusername").put(updateuserName);
router.route("/updatepasssword").put(updatePassword);
router.route("/updatephonenumber").put(updatePhoneNumber);

export default router;






























