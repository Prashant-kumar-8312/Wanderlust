const Listing = require("./models/listing.js")

module.exports.isLoggedIn =(req , res , next) => {
     if(!req.isAuthenticated()){
         req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in to create a listing");
        return res.redirect("/login");
    }

    next();

};

module.exports.savedRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
}; 

module.exports.isOwner =  async (req , res , next) => {

     let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not owner of listing");
         return res.redirect(`/listings/${id}`);
    }
    next();
};