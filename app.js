//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const homeStartingContent =  "Hello Guys! My name is Aansh.This is my first blog website.Its necessary to spread your knowledge around the world.I would love to do it!";
const aboutContent = "My name is Aansh. I am a Computer Engineer,Tech Enthusiast and a Music Lover. Love to code and sing.";
const contactContent = "You can contact me via email. This is my emailid: aansh@gmail.com";

const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI);

const blogSchema = mongoose.Schema({
  title:String,
  body:String
});

const Blog = mongoose.model("Blog",blogSchema);

// var posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  Blog.find({}).exec().then(function(r){
    res.render("home",{startingContent:homeStartingContent,blogs:r});
  }).catch(function(err){
    console.log(err);
  });

});

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  // var blog = {
  //   title:req.body.blogTitle,
  //   data:req.body.blogData
  // }
  // posts.push(blog);
  const titleBlog = req.body.blogTitle;
  const data = req.body.blogData;
  const blogPost = new Blog({
    title:titleBlog,
    body:data
  });
  blogPost.save().then(function(r){
    res.redirect("/");
  }).catch(function(err){
    console.log(err);
  })

});

app.get("/posts/:postTitle",function(req,res){

  // let requestedPost = _.lowerCase(req.params.postTitle);
  let requestedPost = req.params.postTitle;
  Blog.find({}).exec().then(function(storedPosts){
    storedPosts.forEach(function(post){
      const post_id = post._id.toString();
      if(post_id === requestedPost){
        res.render("post",{postTitle:post.title,postData:post.body});
      }
    });
  }).catch(function(err){
    console.log(err);
  });
  // posts.forEach(function(post){
  //   let storedPost = _.lowerCase(post.title);
  //   if(storedPost === requestedPost){
  //     res.render("post",{postTitle:post.title,postData:post.data});
  //   }
  //   // else{
  //   //   console.log("No Match Found.");
  //   // }
  // });

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started");
});
