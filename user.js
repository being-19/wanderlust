const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const userController = require("../controller/user.js");

//signup route
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// login route
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }), userController.login
    );

// Logout route
router.get("/logout", userController.logout);

module.exports = router;
