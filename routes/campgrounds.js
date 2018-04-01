var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");


// INDEX Route
router.get("/", function(req, res){
    Campground.find({}, function(err, camps){
        if(err){
            console.log("ERROR! SOMETHING WENT WRONG!")
        }else{
            res.render("campgrounds/index", {campgrounds: camps, page_title: "Campgrounds"});
        }
    });
});

// CREATE Route
router.post("/", isLoggedIn, function(req, res){
    // get data from form and add to array, and after that redirect to campgroudns
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    
    
    var author = {
        username: req.user.username,
        id: req.user._id
    }
    
    var newCampground = {
        name: name, 
        image: image,
        description: description,
        author: author
    };
    // campgrounds.push({name: name, image: image});
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log("ERROR!");
        }
    });
    res.redirect("/campgrounds");
});

// NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new", {page_title: "New Campground"});
});

// SHOW Route
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(!err){
        console.log(campground);
          res.render("campgrounds/show", {campground: campground, page_title: "New Campground"});
        }
    });

});

// EDIT Route
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE Route
router.put("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE ROUTE
router.delete("/:id/delete", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
     if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground._id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;