const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
//////////////////////////////////////////////////////////////////////////////////
const homeStartingContent = "Welcome to your daily blog.";
const aboutContent = "I'm a junior full stack web developer.";
const contactContent = "contact me.";
//////////////////////////////////////////////////////////////////////////////////
const app = express();
//////////////////////////////////////////////////////////////////////////////////
mongoose.connect(
  "mongodb+srv://Ziad:y5y6y7y8@my-first-cluster.hifjeup.mongodb.net/dailyblogDB"
);
const blogSchema = mongoose.Schema({
  header: String,
  subject: String,
});
const Blog = mongoose.model("Blog", blogSchema);
//////////////////////////////////////////////////////////////////////////////////
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  Blog.find({})
    .then((blog) => {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: blog,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
//////////////////////////////////////////////////////////////////////////////////
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});
//////////////////////////////////////////////////////////////////////////////////
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});
//////////////////////////////////////////////////////////////////////////////////
app.get("/compose", (req, res) => {
  res.render("compose");
});
//////////////////////////////////////////////////////////////////////////////////
app.get("/posts/:postPage", (req, res) => {
  let postName = _.lowerCase(_.kebabCase(req.params.postPage));
  Blog.find({})
    .then((posts) => {
      posts.forEach((post) => {
        let postTitle = _.lowerCase(_.kebabCase(post.header));
        if (postName === postTitle) {
          res.render("post", {
            postTitle: post.header,
            postContent: post.subject,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
//////////////////////////////////////////////////////////////////////////////////
app.post("/compose", (req, res) => {
  const post = {
    title: req.body.newComposeTitle,
    content: req.body.newComposeContent,
  };
  const blog = new Blog({
    header: req.body.newComposeTitle,
    subject: req.body.newComposeContent,
  });
  blog.save();
  res.redirect("/");
});
//////////////////////////////////////////////////////////////////////////////////
app.listen(3000 || process.env.PORT, function () {
  console.log("Server started on port 3000");
});