const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

router.get("/signup" , userController.renderSignupForm );

router.post("/signup" , wrapasync(userController.signup));

router.get("/login" , userController.renderLoginForm);

router.post(
  "/login" ,
  savedRedirectUrl,
 passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) ,

 userController.login
);


router.get("/logout" , (userController.logout));


module.exports = router;