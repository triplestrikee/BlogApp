var express = require("express");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//APP CONFIG
mongoose.connect("mongodb://han:123456@ds163918.mlab.com:63918/blogapp");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//sanitizer after bodyParser
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
        title:String,
        image:String,
        body:String,
        created:{type:Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

// RESTFUL ROUTES - index
app.get("/blogs", function(req, res){
    //get data from database
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            //render to index.ejs file, pass blogs => blogs in index.ejs
            res.render("index", {blogs: blogs}); 
        }
    })
});

// RESTFUL ROUTES - new
app.get("/blogs/new",function(req, res){
   res.render("new"); 
});

// RESTFUL ROUTES - create
app.post("/blogs", function(req, res){
    //get the form, and create in database
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           console.log(err);
       }else{
           //redirect to index page
            res.redirect("/blogs"); 
       }
   }) ;

});

// RESTFUL ROUTES - show
app.get("/blogs/:rari", function(req, res){
    Blog.findById(req.params.rari, function(err, foundBlog){
        if(err){
            console.log("here");
            console.log(err);
            
        }else{
            res.render("show", {blog:foundBlog});
        }
    });
});

// RESTFUL ROUTES - edit
app.get("/blogs/:rari/edit", function(req, res){
    Blog.findById(req.params.rari, function(err, foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("edit", {blog:foundBlog});
        }
    })
    
});


// RESTFUL ROUTES - update
app.put("/blogs/:rari",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.rari, req.body.blog, function(err, updatedBlog){
       if(err){
           console.log(err);
       } else {
           res.redirect("/blogs/" + req.params.rari);
       }
   })
});

// RESTFUL ROUTES - delete
app.delete("/blogs/:rari",function(req, res){
    //delete
    Blog.findByIdAndRemove(req.params.rari, function(err){
        if(err){
            console.log(err);
        } else {
             //redirect  
             res.redirect("/blogs");
        }
    });

});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The blog app server started");
});