const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author" }
            })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", {
            listing,
            currUser: req.user
        });
    } catch (error) {
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};

module.exports.createListing = async (req, res) => {
    if (!req.file) {
        req.flash("error", "Image is required!");
        return res.redirect("/listings/new");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.ownerusername = req.user.username;
    newListing.image = { url: req.file.path, filename: req.file.filename };

    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exixst!");
        return res.redirect("/listings");
    }

    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, orignalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    
    const listing = await Listing.findById(id);
    
    // Update basic fields
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    // If there's a new image, update the image
    if (req.file) {
        listing.image = { 
            url: req.file.path, 
            filename: req.file.filename 
        };
        await listing.save();
    }
    
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

