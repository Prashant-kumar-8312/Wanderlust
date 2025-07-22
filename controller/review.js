const Listing = require("../models/listing.js");
const Review = require("../models/review.js") 
const review = require("../models/review.js");

module.exports.createReview = async(req , res) => {
 //   console.log(req.params.id);
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);
     console.log(newReview);
      newReview.author = req.user._id;
     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();

    // res.send("new review saved");

   //  console.log("new review saved");

   req.flash("success" , "New Review Created");

   res.redirect(`/listings/${listing._id}`);

};

module.exports.destroyReview = async (req , res) => {
    let {id , reviewId} = req.params;
    Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}});
     await Review.findByIdAndDelete(reviewId);
      req.flash("sucess" , "Review Deleted");
     res.redirect(`/listings/${id}`);

};