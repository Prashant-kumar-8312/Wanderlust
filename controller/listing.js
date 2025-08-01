const Listing = require("../models/listing.js");

module.exports.index = async(req , res) => {
  const allListings =  await Listing.find({});
  res.render("listings/index.ejs" , {allListings});
                
};

  module.exports.renderNewForm = async(req , res) => {
    res.render("listings/new.ejs");

  };

  module.exports.showListing = async(req , res) => {
      let {id} = req.params;
      
       const listing =  await Listing.findById(id)
       .populate("reviews")
          .populate("owner");
  
       if(!listing){
          req.flash("error" , "Listing you requested for does not exist  ");
          res.redirect("/listings");
       }
       //console.log(listing);
       res.render("listings/show.ejs" , {listing});

    };

    module.exports.createListing = async (req , res , next) => {
      let url = req.file.path;
      let filename = req.file.filename;
    console.log(url , ".." , filename);

      const newListing = new Listing(req.body.listing);
                 newListing.owner = req.user._id;
                 newListing.image = {url , filename};

   //console.log(newListing.description);
                 await newListing.save();
                 req.flash("success" , "New Listing Created");
                 res.redirect("/listings");
    

};

  module.exports.renderEditForm = async(req , res) => {

    let {id} = req.params;
     const listing =  await Listing.findById(id);
     console.log(listing);
     res.render("listings/edit.ejs" , {listing});

  };


  module.exports.updateListing = async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,  {...req.body.listing});

 //   if( typeof req.file !=="undefined"){
    // let url = req.file.path;
    //  let filename = req.file.filename;
  //  listing.image = {url , filename};
   // await listing.save();
    res.redirect(`/listings/${id}`);
   // }
  };

   module.exports.deleteListing = async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

   };
