const express    = require('express'),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require('mongoose'),
      passport   = require('passport'),
      LocalStrategy = require('passport-local'),
      methodOverride = require("method-override"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      User    = require("./models/user"),
      seedDB = require("./seeds");
 
// Requiring routes    
var commentRoutes =  require("./routes/comments"),
    campgroundRoutes =  require("./routes/campgrounds"),
   indexRoutes =  require("./routes/index");

// MongoDB connect
mongoose.connect('mongodb://localhost/yelpcamp_v6');

// Seed
//seedDB();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(require("express-session")({
    secret: "Just a secret phrase to encrypt our sessions",
    resave: false,
    saveUninitialized: false
    
}));

// Passport    
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp App is running on "+process.env.IP+":"+process.env.PORT);
});