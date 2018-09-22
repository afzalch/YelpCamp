var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: "Algonquin Park",
//   image: "https://cdn.pixabay.com/photo/2015/09/14/13/57/campground-939588__480.jpg",
//   description: "This is a huge park with many lakes to canoe in!"
// }, function(err, campground){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("Newly Created Campground");
//       console.log(campground);
//     }
// });

app.get("/",function(req,res){
  res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds",function(req,res){
  // Get all campgrounds from database before sending and rendering page
  Campground.find({},function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("index", {campgrounds:allCampgrounds});
    }
  });
});

// CREATE - Add campground to database
app.post("/campgrounds",function(req,res){
  // Get data from form and add to campgrounds array
  // Redirect to get to above get route
  var name = req.body.name;
  var imageURL = req.body.image;
  var campgrounDesc = req.body.description;
  var newCampground = {name: name, image: imageURL, description: campgrounDesc};
  // Create a new campground and save to database
  Campground.create(newCampground,function(err, campground){
    if(err){
      console.log(err);
    } else {
      // Redirect automatically assumes it goes to get route
      res.redirect("/campgrounds");
    }
  });
});

// NEW - show form to create new campground
app.get("/campgrounds/new",function(req,res){
  res.render("new.ejs");
})

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req,res){
  // Find campground with provided id
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      // Render show template about that campground
      res.render("show", {campground: foundCampground});
    }
  });
});


app.listen(3000, function(){
  console.log("YelpCamp has Started!");
});
