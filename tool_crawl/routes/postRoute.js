const express = require("express");
const postRoute = express.Router();
const postController = require("../controller/post.controller");
postRoute.get("/getAllPost", postController.getAllPost);
postRoute.put("/updatePost/:postId/:moderator_id", postController.updatePost);

module.exports = postRoute;
