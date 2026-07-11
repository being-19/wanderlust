const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// index & creates route
router.route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.createListing)
);


// New route
router.get("/new", isLoggedIn, (listingcontroller.renderNewForm));

// Show, update & delete route 
router.route("/:id")
    .get(wrapAsync(listingcontroller.showListing))
    .put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.destroyListing));

// Edit route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontroller.renderEditForm));


module.exports = router;