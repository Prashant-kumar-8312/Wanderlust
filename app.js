 if(process.env.NODE_ENV != "production"){
 require("dotenv").config();
 }

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
const path  = require("path");
const methodOverride =  require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapasync.js"); 
const ExpressError = require("./utils/ExpressError.js"); 
//const {listingSchema ,reviewSchema} = require("./schema.js");
//const Review = require("./models/review.js");
//const review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

 main()
.then(() => {
    console.log("connected to DB");

 })
 .catch((err) => {
    console.log(err);
});

async function  main() {
    await mongoose.connect(dbUrl);
    
}

app.set("view engine" , "ejs");
app.set("views" ,  path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: "process.env.SECRET"
  },
  touchAfter: 24 * 3600,
});

store.on("error" ,() => {
  console.log("Error in mongo " , error);
});


 const sessionOptions = {
     store,
     secret: process.env.SECRET,
     resave: false,
     saveUninitialized : true,
     cookie: {
     expires: Date.now() + 7 * 24 * 60 * 60 * 1000 ,
         maxAge :  7 * 24 * 60 * 60 * 1000 ,
         httpOnly: true,
     },

};



// app.get("/" , (req , res) => {
//     res.send("Hi , I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



  app.use((req , res , next) => {
       res.locals.success = req.flash("success");
       res.locals.error = req.flash("error");
       res.locals.currUser = req.user;
   //  console.log(success);
     next();
    });


    app.get("/contry" , (req , res) => {
      console.log("requested country");
    });


  app.use("/listings" , listingRouter);
  app.use("/listings/:id/reviews" , reviewRouter);
  app.use("/" , userRouter);

// app.get("/demouser" , async(req , res) => {
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta-student"
    
//     });

//      let registeredUser = await User.register(fakeUser , "helloworld");
//      res.send(registeredUser);
// })



app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);
    

// const validateListing = (req , res , next) => {
//     let {error} =   listingSchema.validate(req.body);
//     console.log(res);
//     if(error){
//         let errMsg = error.details.map((el) => el.message ).join(" ,");
//       throw new ExpressError(400 , errMsg);
    
//     }else{
//         next();
//     }
    
//     };

    //  const validateReview = (req , res , next) => {
    //      let {error} = review.validate(req.body);
    //      console.log(res);
    //      if(error){
    //          let errMsg = error.details.map((el) => el.message ).join(" ,");
    //        throw new ExpressError(400 , errMsg);
        
    //      }else{
    //          next();
    //      }
        
    //      };


// // Index Route

// app.get("/listings" , wrapAsync(async(req , res) => {
//   const allListings =  await Listing.find({});
//   res.render("listings/index.ejs" , {allListings});

// })

// );

// // New Route



// app.get("/listings/new" , (req , res) => {
//     res.render("listings/new.ejs");


// });

// // Show Route

// app.get("/listings/:id" , wrapAsync(async(req , res) => {
//     let {id} = req.params;
//      const listing =  await Listing.findById(id).populate("reviews");
//      res.render("listings/show.ejs" , {listing});


// })

// );

// // Create Route


// app.post("/listings" , validateListing , wrapAsync(async (req , res , next) => {
//     const newListing = new Listing(req.body.listing);
//  //   console.log(newListing);
//     await newListing.save();
//     res.redirect("/listings");
    

// })

// );

// // Edit Route

// app.get("/listings/:id/edit" , wrapAsync(async(req , res) => {

//     let {id} = req.params;
//      const listing =  await Listing.findById(id);
//      console.log(listing);
//      res.render("listings/edit.ejs" , {listing});


// })

// );


// // Update Route

// app.put("/listing/:id"  , validateListing ,wrapAsync(async(req , res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id ,  {...req.body.listing});
//     res.redirect(`/listings/${id}`);

// })

// );

// // Delete Route

// app.delete("/listings/:id"  , wrapAsync(async(req , res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");

// })

// );

//Reviews

//Post Route

//  app.post("/listings/:id/reviews" , validateReview,  wrapAsync(async(req , res) => {
//      console.log(req.params.id);
//       let listing = await Listing.findById(req.params.id);
//       let newReview = new Review(req.body.review);

//       listing.reviews.push(newReview);

//       await newReview.save();
//       await listing.save();

//    //res.send("new review saved");

//     //console.log("new review saved");

//     res.redirect(`/listings/${listing._id}`);

//  })


//  );


// // // Delete Review Route

// app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async (req , res) => {
//      let {id , reviewId} = req.params;
//      Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}});
//       await Review.findByIdAndDelete(reviewId);
//       res.redirect(`/listings/${id}`);

//  })

//  );









//  app.get("/testListing" , async (req , res) => {
//      let sampleListing = new Listing({
//          title: "My New Villa",
//          description: "By the beach",
//         price: 1200,
//        location: "Calangute , Goa",
//         country: "India"

//     });

//      await sampleListing.save();
//      console.log("sample was saved");
//       res.send("sucessfull testing");
//  });

//app.all("*" , (req , res , next) => {
  //  next(new ExpressError(404 , "Page Not Found!"));

//});

 app.use((err , req , res , next) => {
    let{statusCode=500 , message= "something went wrong"} = err;
    res.status(statusCode).render("error.ejs" , {message});
 });



app.listen(8080 , () => {
    console.log("server is listening to port 8080");
    
});