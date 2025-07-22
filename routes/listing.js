const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js"); 
const ExpressError = require("../utils/ExpressError.js"); 
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload  = multer({storage});


const validateListing = (req , res , next) => {
    let {error} =   listingSchema.validate(req.body);
    console.log(res);
    if(error){
        let errMsg = error.details.map((el) => el.message ).join(" ,");
      throw new ExpressError(400 , errMsg);
    
    }else{
        next();
    }
    
    };   

//     const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/tmp/my-uploads')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })




// Index Route

router.get("/" , wrapAsync(listingController.index));



// New Route



router.get("/new" ,  isLoggedIn , wrapAsync(listingController.renderNewForm));

// router.get("/country" , (req , res) => {
//   console.log("requested country");
// });


// Show Route

router.get("/:id" , wrapAsync(listingController.showListing));

// Create Route


router.post("/" , isLoggedIn ,     upload.single('listing[image]'), validateListing ,  wrapAsync(listingController.createListing));


// Edit Route

router.get("/:id/edit" ,   isLoggedIn ,  isOwner  , wrapAsync(listingController.renderEditForm));


// Update Route

router.put("/:id"  ,     upload.single('listing[image]'), validateListing ,  isLoggedIn , isOwner , wrapAsync(listingController.updateListing));

// Delete Route

router.delete("/:id"  ,  isLoggedIn , wrapAsync(listingController.deleteListing));

module.exports = router;



