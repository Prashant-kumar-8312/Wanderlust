const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js"); 
const ExpressError = require("../utils/ExpressError.js"); 
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

 const validateReview = (req , res , next) => {
        let {error} = review.validate(req.body);
        console.log(res);
        if(error){
            let errMsg = error.details.map((el) => el.message ).join(" ,");
          throw new ExpressError(400 , errMsg);
        
        }else{
            next();
        }
        
        };
        
const reviewController = require("../controller/review.js");

//Reviews

//Post Route

router.post("/" , validateReview, isLoggedIn ,  wrapAsync(reviewController.createReview));


// Delete Review Route

router.delete("/:reviewId" , wrapAsync(reviewController.destroyReview));

module.exports = router;